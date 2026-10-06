// Uso: node tools/gen-codes.mjs [N]
// Genera N códigos secretos (default 10), escribe sus hashes en src/codes.js
// y guarda los códigos en texto plano FUERA del proyecto publicable
// (../piyi-quest-private/codigos.txt).
import { webcrypto } from 'node:crypto';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const privateDir = join(root, '..', 'piyi-quest-private');
const N = Number(process.argv[2] ?? 10);
const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function randomCode() {
  const bytes = webcrypto.getRandomValues(new Uint8Array(6));
  return [...bytes].map((b) => alphabet[b % alphabet.length]).join('');
}

async function hash(id, code) {
  const data = new TextEncoder().encode(`piyi|${id}|${code}`);
  const buf = await webcrypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

const lines = [];
const hashes = {};
for (let id = 1; id <= N; id++) {
  const code = randomCode();
  hashes[id] = await hash(id, code);
  lines.push(`Misión ${id}: ${code}`);
}

writeFileSync(
  join(root, 'src', 'codes.js'),
  `export const CODE_HASHES = ${JSON.stringify(hashes, null, 2)};\n`,
);
mkdirSync(privateDir, { recursive: true });
writeFileSync(join(privateDir, 'codigos.txt'), lines.join('\n') + '\n');
console.log(`Listo: ${N} códigos. Revisa ${join(privateDir, 'codigos.txt')}`);
