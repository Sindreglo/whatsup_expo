# App Icons

This directory contains the app icons used for PWA/web support and native platforms.

## Current Icons (Placeholders)

The following placeholder icons are included. Replace them with your final branded artwork:

| File | Size | Purpose |
|------|------|---------|
| `favicon.png` | 64×64 | Browser tab favicon |
| `icon-192.png` | 192×192 | PWA manifest icon (small) |
| `icon-512.png` | 512×512 | PWA manifest icon (large), Expo app icon |
| `apple-touch-icon.png` | 180×180 | iOS Safari "Add to Home Screen" |

## How to Replace Icons

1. **Design your icons** with a consistent look across all sizes. The primary color is `#0066FF`.

2. **Export as PNG** with transparency if desired. For best results:
   - Use a square canvas
   - Keep important content within the safe zone (center 80%)
   - Export at each required size

3. **Replace the placeholder files** in this directory with your new icons, keeping the same filenames.

4. **Test the PWA icons**:
   ```bash
   npx expo start --web
   ```
   Then use Chrome DevTools → Application → Manifest to verify icons load correctly.

## Generating Icons from a Source Image

If you have a high-resolution source image (512×512 or larger), you can use ImageMagick to generate all sizes:

```bash
# Install ImageMagick if needed
# macOS: brew install imagemagick
# Ubuntu: sudo apt-get install imagemagick

# Generate all icon sizes from source.png
convert source.png -resize 64x64 favicon.png
convert source.png -resize 180x180 apple-touch-icon.png
convert source.png -resize 192x192 icon-192.png
convert source.png -resize 512x512 icon-512.png
```

## Notes

- These icons are used for PWA/web support. Vector icons (@expo/vector-icons) are still used for in-app UI elements.
- The `icon-512.png` is also referenced in `app.json` as the main Expo app icon.
