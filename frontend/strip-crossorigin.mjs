import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const html = resolve(__dirname, 'dist', 'index.html');
let content = readFileSync(html, 'utf8');
content = content.replace(/\s+crossorigin(="[^"]*")?/g, '');
writeFileSync(html, content, 'utf8');
console.log('Stripped crossorigin attributes from index.html');
