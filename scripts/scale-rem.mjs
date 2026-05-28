import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const stylesDir = path.join(__dirname, '../src/styles');
const skipFiles = new Set(['_root-scale.scss']);
const FACTOR = 1.6;

function scaleRem(content) {
  return content.replace(/(?<![\w-])(\d+\.?\d*)rem/g, (match, num) => {
    const scaled = Math.round(parseFloat(num) * FACTOR * 1000) / 1000;
    const str = Number.isInteger(scaled)
      ? String(scaled)
      : String(scaled)
          .replace(/(\.\d*?)0+$/, '$1')
          .replace(/\.$/, '');
    return `${str}rem`;
  });
}

for (const file of fs.readdirSync(stylesDir).filter((f) => f.endsWith('.scss'))) {
  if (skipFiles.has(file)) continue;

  const filePath = path.join(stylesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  if (file === 'certificate-app.scss') {
    content = content.replace(/(\$font-size-base:\s*)[\d.]+rem/, '$11.6rem');
    content = content.replace(
      /(\.cert-plugin-root\s*\{[^}]*font-size:\s*)[\d.]+rem/,
      '$11.6rem',
    );
  }

  fs.writeFileSync(filePath, scaleRem(content));
  console.log('scaled', file);
}
