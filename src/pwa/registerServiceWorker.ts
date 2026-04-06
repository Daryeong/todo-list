type RegisterServiceWorkerOptions = {
  isEnabled?: boolean
  serviceWorkerUrl?: string
  navigatorObject?: Navigator
}

function getNavigatorObject(navigatorObject?: Navigator) {
  if (navigatorObject) {
    return navigatorObject
  }

  if (typeof navigator !== 'undefined') {
    return navigator
  }

  return undefined
}

export async function registerServiceWorker({
  isEnabled = import.meta.env.PROD,
  serviceWorkerUrl = '/sw.js',
  navigatorObject,
}: RegisterServiceWorkerOptions = {}) {
  const resolvedNavigator = getNavigatorObject(navigatorObject)

  if (!isEnabled || !resolvedNavigator || !('serviceWorker' in resolvedNavigator)) {
    return undefined
  }

  return resolvedNavigator.serviceWorker.register(serviceWorkerUrl).catch((error) => {
    console.error('Service worker registration failed', error)
    return undefined
  })
}
