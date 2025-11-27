const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'dist', 'index.html');
const dest = path.join(__dirname, '..', 'dist', '404.html');

if (!fs.existsSync(src)) {
  console.error('dist/index.html not found. Run npm run build:web first.');
  process.exit(1);
}

fs.copyFileSync(src, dest);
console.log('Copied dist/index.html to dist/404.html');
