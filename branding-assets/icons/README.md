# Icons Replacement Guide

This folder stores icon source files for future brand replacements.

## Source Files

- `source/icon-color.svg`: color master icon
- `source/icon-mono.svg`: monochrome icon (theme-friendly)

## Suggested Export Targets

Export from `icon-color.svg`:

- `favicon.ico` (multi-size: 16, 32, 48)
- `favicon-32x32.ico`
- `apple-touch-icon.png` (180x180)
- `icon-192x192.png`
- `icon-192x192.maskable.png`
- `icon-512x512.png`
- `icon-512x512.maskable.png`

Use `icon-mono.svg` for:

- `logo-mono.svg`

Use `icon-color.svg` for:

- `logo.svg`

## Project Target Files To Replace

### Core browser + PWA icons

- `public/favicon.ico`
- `public/favicon-32x32.ico`
- `public/apple-touch-icon.png`
- `public/icons/icon-192x192.png`
- `public/icons/icon-192x192.maskable.png`
- `public/icons/icon-512x512.png`
- `public/icons/icon-512x512.maskable.png`
- `public/logo.svg`
- `public/logo-mono.svg`

### Dynamic favicon states (recommended to keep consistent)

- `public/favicon-progress.ico`
- `public/favicon-done.ico`
- `public/favicon-error.ico`
- `public/favicon-32x32-progress.ico`
- `public/favicon-32x32-done.ico`
- `public/favicon-32x32-error-dev.ico`
- `public/favicon-32x-32-error.ico`
- `public/favicon-dev.ico`
- `public/favicon-progress-dev.ico`
- `public/favicon-done-dev.ico`
- `public/favicon-error-dev.ico`
- `public/favicon-32x32-dev.ico`
- `public/favicon-32x32-progress-dev.ico`
- `public/favicon-32x32-done-dev.ico`

Note: this repository currently includes `public/favicon-32x-32-error.ico`.
The name looks legacy/irregular, but keep it in sync unless it is removed intentionally.

## Entry References Checklist

Confirm these files still point to the expected icon paths:

- `index.html`
- `index.mobile.html`
- `src/app/[variants]/metadata.ts`
- `src/app/manifest.ts`
- `src/layout/GlobalProvider/FaviconProvider.tsx`

## Validation Checklist

After replacement, verify:

1. Browser tab icon on initial load.
2. Browser tab icon while agent is running (progress state).
3. PWA install icon.
4. iOS home-screen icon (`apple-touch-icon`).
