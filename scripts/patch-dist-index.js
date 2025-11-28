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

fs.writeFileSync(file, html, 'utf8');
console.log('Converted absolute paths to relative paths in dist/index.html');
