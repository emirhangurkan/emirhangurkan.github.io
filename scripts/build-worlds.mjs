import { build } from 'esbuild';
import { copyFile } from 'node:fs/promises';

await build({
  entryPoints: ['src/worlds.js'],
  outfile: 'worlds-v1.js',
  bundle: true,
  minify: true,
  format: 'esm',
  target: ['es2022'],
  legalComments: 'eof'
});
await copyFile('node_modules/three/LICENSE', 'THREE-LICENSE.txt');
console.log('Built worlds-v1.js');
