const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'dist', 'index.html');

if (!fs.existsSync(file)) {
  console.error('dist/index.html not found. Run npm run build:web first.');
  process.exit(1);
}

let html = fs.readFileSync(file, 'utf8');

// Convert absolute paths to relative paths for src and href attributes
// This handles paths like /favicon.ico -> ./favicon.ico and /_expo/... -> ./_expo/...
// The (?!\/) negative lookahead excludes protocol-relative URLs like //example.com
html = html.replace(/(src|href)="\/(?!\/)/g, '$1="./');

// Add PWA meta tags for apple-touch-icon and enhanced mobile web app support
// These complement the theme-color already added by Expo from app.json
const pwaMetaTags = [
  '<!-- PWA meta tags for WhatsUp app - see web/index.html for documentation -->',
  '<meta name="apple-mobile-web-app-capable" content="yes" />',
  '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />',
  '<meta name="apple-mobile-web-app-title" content="WhatsUp" />',
  '<link rel="apple-touch-icon" href="./assets/icons/apple-touch-icon.png" />'
].join('\n  ');

// Insert PWA tags before closing </head> tag
html = html.replace('</head>', '\n  ' + pwaMetaTags + '\n</head>');

fs.writeFileSync(file, html, 'utf8');
console.log('Patched dist/index.html with relative paths and PWA meta tags');
