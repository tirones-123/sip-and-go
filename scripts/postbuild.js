const fs = require('fs');
const path = require('path');

// Ensure dist directory exists
const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// Create assets directory in dist
const assetsDir = path.join(distDir, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir);
}

// Copy logo files
const logoSource = path.join(__dirname, '..', 'assets', 'logo-jauneclair.png');
const logoDestinations = [
  path.join(distDir, 'logo-jauneclair.png'),
  path.join(assetsDir, 'logo-jauneclair.png'),
  path.join(distDir, 'apple-touch-icon.png')
];

logoDestinations.forEach(dest => {
  if (fs.existsSync(logoSource)) {
    fs.copyFileSync(logoSource, dest);
    console.log(`Copied logo to ${dest}`);
  }
});

// Copy manifest
const manifestSource = path.join(__dirname, '..', 'public', 'manifest.json');
const manifestDest = path.join(distDir, 'manifest.json');
if (fs.existsSync(manifestSource)) {
  fs.copyFileSync(manifestSource, manifestDest);
  console.log('Copied manifest.json');
}

// Copy service worker
const swSource = path.join(__dirname, '..', 'public', 'sw.js');
const swDest = path.join(distDir, 'sw.js');
if (fs.existsSync(swSource)) {
  fs.copyFileSync(swSource, swDest);
  console.log('Copied sw.js');
}

console.log('Post-build script completed!'); 