import { build } from 'esbuild';
import { copyFile } from 'node:fs/promises';

const result = await build({
  entryPoints: { 'worlds-v1': 'src/worlds.js' },
  outdir: '.',
  splitting: true,
  metafile: true,
  chunkNames: 'assets/scene-3d-[hash]',
  bundle: true,
  minify: true,
  format: 'esm',
  target: ['es2022'],
  legalComments: 'eof'
});
const entry = result.metafile.outputs['worlds-v1.js'];
if (entry.bytes > 20000 || Object.keys(entry.inputs).some(path => path.includes('node_modules/three/'))) {
  throw new Error('The initial page must stay under 20 kB and must not bundle Three.js.');
}
await copyFile('node_modules/three/LICENSE', 'THREE-LICENSE.txt');
console.log(`Initial JavaScript: ${entry.bytes} bytes. 3D is a separate, optional download.`);
