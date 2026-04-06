const CACHE_NAME = 'today-focus-shell-v3'
const APP_SHELL_URL = new URL('./', self.location.href)
const APP_SHELL_PATH = APP_SHELL_URL.pathname
const INDEX_PATH = new URL('index.html', APP_SHELL_URL).pathname
const OPTIONAL_APP_SHELL_ASSETS = ['manifest.webmanifest', 'favicon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png']

function toAbsoluteUrl(path) {
  return new URL(path, APP_SHELL_URL).toString()
}

function extractTagAttributes(htmlText, tagName) {
  const pattern = new RegExp(`<${tagName}([^>]*)>`, 'gi')
  const attributes = []

  for (const match of htmlText.matchAll(pattern)) {
    const [, attributeText = ''] = match
    const entry = {}

    for (const attributeMatch of attributeText.matchAll(/([a-zA-Z:-]+)=["']([^"']+)["']/g)) {
      const [, name = '', value = ''] = attributeMatch
      entry[name.toLowerCase()] = value
    }

    attributes.push(entry)
  }

  return attributes
}

function getCachedAppShell() {
  return caches.match(APP_SHELL_PATH).then((response) => response || caches.match(INDEX_PATH))
}

function isSuccessfulAppShellResponse(response) {
  return response.ok && (response.headers.get('content-type') || '').includes('text/html')
}

async function cacheAppShellResponse(cache, response) {
  if (!isSuccessfulAppShellResponse(response)) {
    return
  }

  const rootResponse = response.clone()
  const indexResponse = response.clone()

  await Promise.all([cache.put(APP_SHELL_PATH, rootResponse), cache.put(INDEX_PATH, indexResponse)])
}

async function cacheAssetUrl(cache, assetUrl, { required = false } = {}) {
  try {
    const response = await fetch(assetUrl, { cache: 'no-cache' })

    if (!response.ok) {
      if (required) {
        throw new Error(`Asset request failed with status ${response.status}: ${assetUrl}`)
      }

      return
    }

    await cache.put(assetUrl, response)
  } catch (error) {
    if (required) {
      throw error
    }

    return
  }
}

function extractAppShellAssetUrls(htmlText) {
  const requiredAssetUrls = new Set()
  const optionalAssetUrls = new Set(OPTIONAL_APP_SHELL_ASSETS.map((path) => toAbsoluteUrl(path)))

  for (const scriptTag of extractTagAttributes(htmlText, 'script')) {
    if (scriptTag.src) {
      requiredAssetUrls.add(toAbsoluteUrl(scriptTag.src))
    }
  }

  for (const linkTag of extractTagAttributes(htmlText, 'link')) {
    if (!linkTag.href) {
      continue
    }

    if (['stylesheet', 'modulepreload'].includes(linkTag.rel)) {
      requiredAssetUrls.add(toAbsoluteUrl(linkTag.href))
      continue
    }

    optionalAssetUrls.add(toAbsoluteUrl(linkTag.href))
  }

  return {
    requiredAssetUrls: [...requiredAssetUrls],
    optionalAssetUrls: [...optionalAssetUrls],
  }
}

async function precacheAppShell() {
  const cache = await caches.open(CACHE_NAME)
  const indexResponse = await fetch(APP_SHELL_PATH, { cache: 'no-cache' })

  if (!isSuccessfulAppShellResponse(indexResponse)) {
    throw new Error(`App shell request failed with status ${indexResponse.status}`)
  }

  const indexClone = indexResponse.clone()
  const htmlText = await indexResponse.text()
  const { requiredAssetUrls, optionalAssetUrls } = extractAppShellAssetUrls(htmlText)

  await cacheAppShellResponse(cache, indexClone)
  await Promise.all(requiredAssetUrls.map((assetUrl) => cacheAssetUrl(cache, assetUrl, { required: true })))
  await Promise.all(optionalAssetUrls.map((assetUrl) => cacheAssetUrl(cache, assetUrl)))
}

self.addEventListener('install', (event) => {
  event.waitUntil(precacheAppShell().then(() => self.skipWaiting()))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  )
})

function isCacheableStaticAsset(request, url) {
  return url.origin === self.location.origin && ['font', 'image', 'script', 'style'].includes(request.destination)
}

self.addEventListener('fetch', (event) => {
  const { request } = event

  if (request.method !== 'GET') {
    return
  }

  const url = new URL(request.url)

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(async (response) => {
          if (isSuccessfulAppShellResponse(response)) {
            const responseClone = response.clone()
            void caches.open(CACHE_NAME).then((cache) => cacheAppShellResponse(cache, responseClone))
          }

          return response
        })
        .catch(() => getCachedAppShell()),
    )
    return
  }

  if (!isCacheableStaticAsset(request, url)) {
    return
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }

      return fetch(request)
        .then((response) => {
          if (response.ok) {
            const responseClone = response.clone()
            void caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone))
          }

          return response
        })
        .catch(() => Response.error())
    }),
  )
})
