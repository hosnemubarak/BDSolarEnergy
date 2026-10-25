import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(path.join(dir, f));
    }
  });
}

const publicImages = fs.readdirSync('public/images');
console.log('Available public images:', publicImages);

const externalUrls = [];
const missingLocalImages = [];

walkDir('src', (filePath) => {
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx') && !filePath.endsWith('.html') && !filePath.endsWith('.css')) return;
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Find external image URLs
  const httpMatches = content.match(/https?:\/\/[^\s'"\)>]+\.(jpg|jpeg|png|webp|svg|gif)[^\s'"\)>]*/gi) || [];
  httpMatches.forEach(url => {
    externalUrls.push({ file: filePath, url });
  });

  // Find Unsplash references
  const unsplashMatches = content.match(/https?:\/\/[^\s'"\)>]*unsplash[^\s'"\)>]*/gi) || [];
  unsplashMatches.forEach(url => {
    externalUrls.push({ file: filePath, url });
  });

  // Find /images/... references and check if they exist in public/images
  const localMatches = content.match(/\/images\/[a-zA-Z0-9_\-\.]+/g) || [];
  localMatches.forEach(img => {
    const filename = img.replace('/images/', '');
    if (!publicImages.includes(filename)) {
      missingLocalImages.push({ file: filePath, img, filename });
    }
  });
});

console.log('External URLs found:', externalUrls);
console.log('Missing Local Images found:', missingLocalImages);
