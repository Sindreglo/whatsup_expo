const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'dist', 'index.html');

if (!fs.existsSync(file)) {
  console.error('dist/index.html not found. Run npm run build:web first.');
  process.exit(1);
}

let html = fs.readFileSync(file, 'utf8');

if (/<base\s+href=/i.test(html)) {
  console.log('base tag already present in dist/index.html');
  process.exit(0);
}

// Insert <base href="./"> right after the opening <head> tag
html = html.replace(/<head(\s[^>]*)?>/i, match => `${match}\n  <base href="./">`);
fs.writeFileSync(file, html, 'utf8');
console.log('Inserted <base href="./"> into dist/index.html');
