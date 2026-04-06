import { afterEach, describe, expect, it, vi } from 'vitest'

import { registerServiceWorker } from './registerServiceWorker'

const originalNavigator = window.navigator
const originalConsoleError = console.error

afterEach(() => {
  Object.defineProperty(window, 'navigator', {
    configurable: true,
    value: originalNavigator,
  })
  console.error = originalConsoleError
  vi.restoreAllMocks()
})

describe('registerServiceWorker', () => {
  it('registers the service worker immediately when enabled', async () => {
    const register = vi.fn().mockResolvedValue(undefined)

    Object.defineProperty(window, 'navigator', {
      configurable: true,
      value: {
        ...originalNavigator,
        serviceWorker: {
          register,
        },
      },
    })

    await expect(registerServiceWorker({ isEnabled: true })).resolves.toBeUndefined()

    expect(register).toHaveBeenCalledWith('/sw.js')
  })

  it('skips registration when disabled', async () => {
    const register = vi.fn().mockResolvedValue(undefined)

    Object.defineProperty(window, 'navigator', {
      configurable: true,
      value: {
        ...originalNavigator,
        serviceWorker: {
          register,
        },
      },
    })

    await expect(registerServiceWorker({ isEnabled: false })).resolves.toBeUndefined()

    expect(register).not.toHaveBeenCalled()
  })

  it('skips registration when service workers are unavailable', async () => {
    const consoleErrorSpy = vi.fn()
    console.error = consoleErrorSpy

    Object.defineProperty(window, 'navigator', {
      configurable: true,
      value: originalNavigator,
    })

    await expect(registerServiceWorker({ isEnabled: true, navigatorObject: undefined })).resolves.toBeUndefined()

    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })

  it('reports registration failures', async () => {
    const error = new Error('register failed')
    const register = vi.fn().mockRejectedValue(error)
    const consoleErrorSpy = vi.fn()
    console.error = consoleErrorSpy

    Object.defineProperty(window, 'navigator', {
      configurable: true,
      value: {
        ...originalNavigator,
        serviceWorker: {
          register,
        },
      },
    })

    await expect(registerServiceWorker({ isEnabled: true })).resolves.toBeUndefined()

    expect(consoleErrorSpy).toHaveBeenCalledWith('Service worker registration failed', error)
  })
})
