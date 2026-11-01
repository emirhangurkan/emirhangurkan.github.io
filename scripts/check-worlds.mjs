import assert from 'node:assert/strict';
import { createProjectWorlds } from '../src/project-worlds.js';
const { getWorld } = createProjectWorlds();
const budgets = { intro: 10000, play: 40000, story: 16000, connect: 9000 };
for (const [name, budget] of Object.entries(budgets)) {
  assert.equal(getWorld(name, false), undefined, `${name} must be created lazily`);
  const world = getWorld(name);
  let triangles = 0;
  world.traverse(object => {
    if (!object.isMesh) return;
    const geometry = object.geometry;
    triangles += (geometry.index?.count ?? geometry.attributes.position.count) / 3 * (object.isInstancedMesh ? object.count : 1);
    geometry.computeBoundingBox();
    assert([...geometry.boundingBox.min, ...geometry.boundingBox.max].every(Number.isFinite), `${name} has invalid bounds`);
  });
  assert(triangles <= budget, `${name}: ${triangles} exceeds its geometry budget ${budget}`);
  assert.equal(getWorld(name), world, 'reuse constructed worlds');
  console.log(`${name}: ${triangles} triangles, lazy construction and valid bounds verified`);
}
