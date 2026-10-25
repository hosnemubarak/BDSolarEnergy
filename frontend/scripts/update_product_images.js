import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/data/products.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Replace Unsplash URLs depending on nearby categoryId or by regex
const mapByCategory = {
  'solar-panels': '/images/solar-panel.svg',
  'solar-inverters': '/images/solar-inverter.svg',
  'solar-batteries': '/images/solar-battery.svg',
  'solar-charge-controllers': '/images/solar-inverter.svg',
  'wires-cables': '/images/solar-cable.svg',
  'electrical-protection': '/images/circuit-breaker.svg',
  'switches-sockets-lighting': '/images/led-lighting.svg',
  'electrical-installation-tools': '/images/electrical-tools.svg',
  'solar-complete-kits': '/images/solar-package.svg',
  'power-backup-accessories': '/images/solar-inverter.svg',
};

// We can replace product blocks accurately
// Let's parse each product block
const blocks = content.split('  {\n    id: ');
const newBlocks = [blocks[0]];

for (let i = 1; i < blocks.length; i++) {
  let block = '    id: ' + blocks[i];
  
  // Find categoryId
  const match = block.match(/categoryId:\s*'([^']+)'/);
  if (match) {
    const cat = match[1];
    const localImg = mapByCategory[cat] || '/images/solar-panel.svg';
    
    // Replace image
    block = block.replace(/image:\s*'[^']+'/, `image: '${localImg}'`);
    
    // Replace gallery
    block = block.replace(/gallery:\s*\[[\s\S]*?\],/, `gallery: [\n      '${localImg}',\n      '/images/solar-package.svg',\n    ],`);
  }
  
  newBlocks.push(block);
}

const updatedContent = newBlocks.join('  {\n');
fs.writeFileSync(filePath, updatedContent);
console.log('Successfully updated all product images in src/data/products.ts to local SVGs!');
