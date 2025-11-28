const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const src = path.join(distDir, 'index.html');
const dest = path.join(distDir, '404.html');
const nojekyll = path.join(distDir, '.nojekyll');

if (!fs.existsSync(src)) {
  console.error('dist/index.html not found. Run npm run build:web first.');
  process.exit(1);
}

fs.copyFileSync(src, dest);
console.log('Copied dist/index.html to dist/404.html');

// Create .nojekyll file to prevent GitHub Pages from ignoring files starting with underscore
fs.writeFileSync(nojekyll, '');
console.log('Created .nojekyll file to disable Jekyll processing');
