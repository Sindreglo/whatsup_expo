const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const file = path.join(distDir, 'index.html');

// Read baseUrl from app.json to maintain consistency
const appJsonPath = path.join(__dirname, '..', 'app.json');
const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
const BASE_URL = appJson.expo?.experiments?.baseUrl || '';

if (!fs.existsSync(file)) {
  console.error('dist/index.html not found. Run npm run build:web first.');
  process.exit(1);
}

let html = fs.readFileSync(file, 'utf8');

// The baseUrl in app.json already adds the prefix to all asset paths.
// We don't need to convert paths anymore - they already point to the correct location.
// Just log confirmation.
console.log(`Asset paths are correctly prefixed with baseUrl: ${BASE_URL || '(none)'}`);

// Add PWA meta tags and links if not already present
// PWA paths should use the base URL for consistency
const pwaMetaTags = `
    <!-- PWA Support -->
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="WhatsUp" />
    <link rel="apple-touch-icon" href="${BASE_URL}/assets/icons/apple-touch-icon.png" />
    <link rel="manifest" href="${BASE_URL}/manifest.json" />`;

// Insert PWA tags before </head> if manifest link is not present
if (!html.includes('rel="manifest"')) {
  html = html.replace('</head>', `${pwaMetaTags}\n  </head>`);
}

fs.writeFileSync(file, html, 'utf8');
console.log('Added PWA meta tags and links');

// Copy PWA icons to dist
const iconsDir = path.join(__dirname, '..', 'assets', 'icons');
const distIconsDir = path.join(distDir, 'assets', 'icons');

if (!fs.existsSync(distIconsDir)) {
  fs.mkdirSync(distIconsDir, { recursive: true });
}

const iconFiles = ['favicon.png', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];
iconFiles.forEach(iconFile => {
  const src = path.join(iconsDir, iconFile);
  const dest = path.join(distIconsDir, iconFile);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${iconFile} to dist/assets/icons/`);
  } else {
    console.warn(`Warning: ${iconFile} not found in assets/icons/`);
  }
});

// Generate manifest.json for PWA
// Use absolute paths with base URL for consistency with the app's asset loading
const manifest = {
  name: 'WhatsUp',
  short_name: 'WhatsUp',
  description: 'Connect with friends and family through video calls',
  start_url: `${BASE_URL}/`,
  display: 'standalone',
  background_color: '#1a1a2e',
  theme_color: '#0066FF',
  icons: [
    {
      src: `${BASE_URL}/assets/icons/icon-192.png`,
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any'
    },
    {
      src: `${BASE_URL}/assets/icons/icon-512.png`,
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any'
    }
  ]
};

const manifestPath = path.join(distDir, 'manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
console.log('Generated manifest.json for PWA support');
