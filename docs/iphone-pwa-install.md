# iPhone PWA Install Guide

This project is PWA-only. On iPhone, open it in Safari and add it to the Home Screen.

## Requirements

- The site must be served over `https://`, or from `localhost` / `127.0.0.1` for local testing.
- For real device testing, a deployed HTTPS URL is the safest option.
- `npm run dev` is for development only. Use a production build or deployment when checking install and offline behavior.

## Install Steps

1. Open the app URL in Safari on iPhone.
2. Tap the Share button.
3. Choose `Add to Home Screen`.
4. If `Open as Web App` is shown, turn it on.
5. Tap `Add`.

If `Add to Home Screen` is missing, scroll down in the Share sheet and use `Edit Actions` to add it.

## After Installation

- The app appears on the Home Screen with its own icon.
- Tapping the icon opens the app in standalone mode instead of a normal browser tab.
- Data is stored in the device's browser storage.

## References

- Apple Support: [Turn a website into an app in Safari on iPhone](https://support.apple.com/guide/iphone/open-as-web-app-iphea86e5236/ios)
- MDN: [Making PWAs installable](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable)
