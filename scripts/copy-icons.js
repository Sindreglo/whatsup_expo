/**
 * copy-icons.js
 * 
 * Copies PWA icons from assets/icons/ to dist/assets/icons/ for the web build.
 * The icons are placeholder images until designer-provided artwork is available.
 * 
 * To replace with final artwork:
 * 1. Replace files in assets/icons/ with your designed icons
 * 2. favicon.png: 64x64 pixels
 * 3. icon-192.png: 192x192 pixels
 * 4. icon-512.png: 512x512 pixels
 * 5. apple-touch-icon.png: 180x180 pixels
 * 6. Rebuild the web app with: npm run build:web
 */

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'assets', 'icons');
const destDir = path.join(__dirname, '..', 'dist', 'assets', 'icons');

// Create destination directory if it doesn't exist
fs.mkdirSync(destDir, { recursive: true });

// Copy all icon files
const icons = ['favicon.png', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];

icons.forEach(icon => {
  const src = path.join(srcDir, icon);
  const dest = path.join(destDir, icon);
  
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${icon} to dist/assets/icons/`);
  } else {
    console.warn(`Warning: ${icon} not found in assets/icons/`);
  }
});

console.log('PWA icons copied successfully');
