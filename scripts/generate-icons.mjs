import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const svg = readFileSync(join(root, 'public/icon.svg'));

const sizes = [
  { name: 'favicon-32.png', size: 32 },
  { name: 'favicon-128.png', size: 128 },
  { name: 'favicon-192.png', size: 192 },
  { name: 'favicon-512.png', size: 512 },
];

for (const { name, size } of sizes) {
  const buffer = await sharp(svg).resize(size, size).png().toBuffer();
  writeFileSync(join(root, 'public/images', name), buffer);
}

const icoBuffer = await sharp(svg).resize(32, 32).png().toBuffer();

writeFileSync(join(root, 'public/favicon.ico'), icoBuffer);
writeFileSync(join(root, 'favicon.ico'), icoBuffer);

console.log('Generated PWA icons from public/icon.svg');
