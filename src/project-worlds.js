import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const physical = (color, properties = {}) => new THREE.MeshPhysicalMaterial({
  color, roughness: .3, metalness: .06, clearcoat: .8, clearcoatRoughness: .2, ...properties
});

function mesh(parent, geometry, material, x = 0, y = 0, z = 0) {
  const object = new THREE.Mesh(geometry, material);
  object.position.set(x, y, z);
  parent.add(object);
  return object;
}

function tube(parent, points, material, radius = .012) {
  return mesh(parent, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 96, radius, 8, false), material);
}

// The four original piece colors and the board palette come from BlockBluupTheme.cs.
function createPlay() {
  const group = new THREE.Group();
  const board = new THREE.Group();
  group.add(board);
  board.position.set(.05, -.07, -.28);
  const cream = physical(0xfff6de, { roughness: .38 });
  const teal = physical(0x075b78, { roughness: .27 });
  mesh(board, new RoundedBoxGeometry(3.48, 3.48, .24, 4, .18), cream);
  mesh(board, new RoundedBoxGeometry(3.36, 3.36, .25, 4, .14), teal, 0, 0, .045);

  const helper = new THREE.Object3D();
  const slots = new THREE.InstancedMesh(new RoundedBoxGeometry(.352, .352, .065, 3, .053), physical(0x699fb1, { roughness: .5, clearcoat: .2 }), 64);
  const cell = (x, y) => [(x - 3.5) * .39, (3.5 - y) * .39];
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      helper.position.set(...cell(x, y), .18);
      helper.updateMatrix();
      slots.setMatrixAt(y * 8 + x, helper.matrix);
    }
  }
  board.add(slots);
  const colors = [0xff6953, 0x59d3aa, 0x36aef1, 0xffbe2c];
  const puzzle = [
    '........',
    '......11',
    '......11',
    '00....2.',
    '00..222.',
    '33..0.11',
    '33000.11',
    '22231111'
  ];
  const cells = puzzle.join('').split('').filter(value => value !== '.');
  const tileGeometry = new RoundedBoxGeometry(.352, .352, .235, 4, .075);
  const tileMaterial = physical(0xffffff, { roughness: .23, clearcoat: 1 });
  const tiles = new THREE.InstancedMesh(tileGeometry, tileMaterial, cells.length);
  let index = 0;
  puzzle.forEach((row, y) => [...row].forEach((value, x) => {
    if (value === '.') return;
    helper.position.set(...cell(x, y), .285);
    helper.updateMatrix();
    tiles.setMatrixAt(index, helper.matrix);
    tiles.setColorAt(index++, new THREE.Color(colors[Number(value)]));
  }));
  board.add(tiles);

  function piece(coordinates, color, position, scale = 1) {
    const pieceGroup = new THREE.Group();
    const material = physical(color, { roughness: .22, clearcoat: 1 });
    for (const [x, y] of coordinates) mesh(pieceGroup, tileGeometry, material, x * .39, y * .39);
    pieceGroup.position.set(...position);
    pieceGroup.scale.setScalar(scale);
    group.add(pieceGroup);
    return pieceGroup;
  }
  const blue = piece([[0, 0], [1, 0], [0, 1], [1, 1]], colors[2], [-.6, .35, .75], 1.08);
  const coral = piece([[0, 0], [0, 1], [0, 2], [1, 0]], colors[0], [-1.9, .8, .65], 1.07);
  coral.rotation.set(.18, -.25, -.35);
  const gold = piece([[0, 0], [-1, 0], [1, 0], [0, 1]], colors[3], [1.1, 1.9, .4], 1.04);
  gold.rotation.set(.2, .2, -.16);
  const mint = piece([[0, 0], [1, 0], [1, 1]], colors[1], [1.42, -1.65, .72], .88);
  mint.rotation.set(.12, -.2, .28);

  // A small cloud recalls the game's nature-and-clouds theme without a flat backdrop.
  const cloud = new THREE.Group();
  const cloudMaterial = physical(0xf7fcff, { roughness: .65, clearcoat: .1 });
  const puff = new THREE.SphereGeometry(1, 20, 14);
  [[-.25, 0, .25], [0, .1, .35], [.32, -.02, .23]].forEach(([x, y, size]) => {
    const part = mesh(cloud, puff, cloudMaterial, x, y, 0);
    part.scale.set(size, size * .8, size * .8);
  });
  cloud.position.set(-1.05, 1.97, -.7);
  group.add(cloud);

  return { group, animate(time) {
    group.rotation.set(.19 + Math.sin(time * .21) * .04, -.28 + Math.sin(time * .18) * .11, -.13);
    blue.position.z = .63 + (Math.sin(time * .75) + 1) * .24;
    blue.rotation.z = .025 + Math.sin(time * .35) * .06;
    coral.position.y = .8 + Math.sin(time * .65) * .09;
    gold.position.y = 1.86 + Math.sin(time * .55 + 1) * .1;
    mint.position.y = -1.65 + Math.sin(time * .6 + 2) * .09;
    cloud.position.x = -1.05 + Math.sin(time * .2) * .09;
  } };
}

// Hand-built curves follow the approved fingerprint/question-mark identity.
// Coordinates share a reference plane with the original mark, rather than a text glyph.
function createStory() {
  const group = new THREE.Group();
  const red = physical(0xf4402e, { metalness: .38, roughness: .25, clearcoat: 1, emissive: 0x8b170c, emissiveIntensity: .16 });
  const warmMetal = physical(0xc9a45c, { metalness: .8, roughness: .36 });
  const toPoint = (x, y, z = 0) => new THREE.Vector3((x - 625) * .0041, (625 - y) * .0041, z);
  const paths = [
    [[434, 173], [574, 80, 776, 116, 884, 233], [986, 345, 967, 507, 916, 592], [844, 713, 706, 714, 710, 890]],
    [[321, 352], [356, 227, 548, 150, 699, 207], [835, 255, 887, 375, 871, 492], [854, 652, 649, 665, 654, 876]],
    [[438, 444], [436, 358, 519, 305, 605, 320], [744, 343, 803, 449, 753, 554], [703, 659, 595, 686, 599, 863]],
    [[671, 501], [692, 450, 648, 400, 606, 389], [551, 371, 514, 401, 511, 451], [510, 497, 483, 527, 435, 526], [379, 525, 349, 489, 357, 433], [372, 336, 467, 270, 562, 258], [680, 243, 773, 315, 796, 414], [830, 557, 690, 622, 615, 706], [564, 761, 544, 799, 543, 832]]
  ];
  paths.forEach((commands, index) => {
    const path = new THREE.CurvePath();
    let start = toPoint(...commands[0], index * .025);
    for (const command of commands.slice(1)) {
      const end = toPoint(command[4], command[5], index * .025);
      path.add(new THREE.CubicBezierCurve3(start, toPoint(command[0], command[1], index * .025), toPoint(command[2], command[3], index * .025), end));
      start = end;
    }
    const ridge = mesh(group, new THREE.TubeGeometry(path, 170, .083, 10, false), red);
    ridge.scale.z = .8;
    for (const endpoint of [path.getPoint(0), path.getPoint(1)]) {
      const cap = mesh(group, new THREE.SphereGeometry(.083, 14, 10), red, endpoint.x, endpoint.y, endpoint.z * .8);
      cap.scale.z = .8;
    }
  });
  const dot = mesh(group, new THREE.SphereGeometry(.425, 40, 24), red, 0, -1.68, .04);
  dot.scale.z = .39;

  const evidence = new THREE.Group();
  evidence.position.z = -.42;
  group.add(evidence);
  const fineGold = new THREE.MeshBasicMaterial({ color: 0xc9a45c, transparent: true, opacity: .36 });
  // Open registration corners, like the edges of a dossier on the evidence table.
  for (const [x, y] of [[-1.62, 2.12], [1.62, 2.12], [-1.62, -2.12], [1.62, -2.12]]) {
    const sx = Math.sign(x), sy = Math.sign(y);
    tube(evidence, [new THREE.Vector3(x - sx * .28, y, 0), new THREE.Vector3(x, y, 0), new THREE.Vector3(x, y - sy * .28, 0)], fineGold, .009);
  }
  const points = [[-1.75, -.52], [-1.58, .18], [-1.9, .66], [1.63, -.87], [1.9, -.28]];
  points.forEach(([x, y]) => mesh(evidence, new THREE.SphereGeometry(.028, 12, 8), warmMetal, x, y));
  const redThread = new THREE.MeshBasicMaterial({ color: 0xa3241a, transparent: true, opacity: .52 });
  tube(evidence, points.slice(0, 3).map(([x, y]) => new THREE.Vector3(x, y, 0)), redThread, .006);
  tube(evidence, points.slice(3).map(([x, y]) => new THREE.Vector3(x, y, 0)), redThread, .006);

  return { group, animate(time) {
    group.rotation.set(.025, -.13 + Math.sin(time * .22) * .16, -.035);
    red.emissiveIntensity = .13 + Math.sin(time * .65) * .035;
  } };
}

// Shield, crossed blades and diamond use the application's CampaignEmblem proportions.
function createConnect() {
  const group = new THREE.Group();
  const bronze = physical(0xd5b478, { metalness: .86, roughness: .32 });
  const leather = physical(0x322721, { metalness: .15, roughness: .75, clearcoat: .13 });
  const steel = physical(0xd8cbb1, { metalness: .92, roughness: .23 });
  const darkSteel = physical(0x343b39, { metalness: .75, roughness: .35 });
  const point = (x, y) => [(x - 36) * .043, (41.5 - y) * .043];
  function polygon(coordinates, material, depth, z, bevel = .018) {
    const shape = new THREE.Shape();
    coordinates.forEach(([x, y], index) => shape[index ? 'lineTo' : 'moveTo'](...point(x, y)));
    shape.closePath();
    return mesh(group, new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: bevel, bevelThickness: bevel, curveSegments: 20 }), material, 0, 0, z);
  }
  const shield = new THREE.Shape();
  shield.moveTo(...point(4, 5)); shield.lineTo(...point(36, 0)); shield.lineTo(...point(68, 5)); shield.lineTo(...point(66, 48));
  shield.quadraticCurveTo(...point(61, 69), ...point(36, 83));
  shield.quadraticCurveTo(...point(11, 69), ...point(6, 48)); shield.closePath();
  const shieldGeometry = new THREE.ExtrudeGeometry(shield, { depth: .19, bevelEnabled: true, bevelSegments: 4, steps: 1, bevelSize: .065, bevelThickness: .06, curveSegments: 28 });
  mesh(group, shieldGeometry, bronze, 0, 0, -.12);
  const face = mesh(group, shieldGeometry, leather, 0, .015, .095);
  face.scale.set(.935, .942, .35);

  // Two offset, bevelled blade faces catch the light independently as the crest turns.
  polygon([[15, 17], [20, 19], [51, 54], [48, 57], [17, 22]], steel, .065, .25);
  polygon([[57, 17], [52, 19], [21, 54], [24, 57], [55, 22]], steel, .065, .34);
  polygon([[41, 54], [46, 49], [55, 59], [51, 63]], bronze, .09, .32);
  polygon([[17, 59], [26, 49], [31, 54], [21, 63]], bronze, .09, .41);
  polygon([[49, 63], [54, 59], [60, 66], [55, 70]], darkSteel, .075, .32);
  polygon([[12, 66], [18, 59], [23, 63], [17, 70]], darkSteel, .075, .41);
  polygon([[36, 12], [39, 17], [36, 22], [33, 17]], bronze, .07, .27);
  for (const [x, y] of [[9, 10], [20, 8], [52, 8], [63, 10], [10, 34], [62, 34], [16, 59], [56, 59], [36, 76]]) {
    const [px, py] = point(x, y);
    const rivet = mesh(group, new THREE.SphereGeometry(.039, 12, 8), bronze, px, py, .24);
    rivet.scale.z = .6;
  }

  const compass = new THREE.Group();
  compass.position.z = -.65;
  group.add(compass);
  const engraving = new THREE.MeshBasicMaterial({ color: 0xd5b478, transparent: true, opacity: .25 });
  mesh(compass, new THREE.TorusGeometry(2.04, .007, 6, 160), engraving);
  mesh(compass, new THREE.TorusGeometry(2.14, .004, 5, 160), engraving);
  const ticks = new THREE.InstancedMesh(new THREE.BoxGeometry(.009, .06, .009), engraving, 48);
  const helper = new THREE.Object3D();
  for (let i = 0; i < 48; i++) {
    const angle = i / 48 * Math.PI * 2;
    helper.position.set(Math.sin(angle) * 2.09, Math.cos(angle) * 2.09, 0);
    helper.rotation.z = -angle;
    helper.scale.y = i % 4 === 0 ? 1.6 : .65;
    helper.updateMatrix();
    ticks.setMatrixAt(i, helper.matrix);
  }
  compass.add(ticks);
  return { group, animate(time) {
    group.rotation.set(.06, -.24 + Math.sin(time * .2) * .19, -.12);
    compass.rotation.z = Math.sin(time * .1) * .035;
  } };
}

export function createProjectWorlds() {
  const factories = { play: createPlay, story: createStory, connect: createConnect };
  const worlds = {};
  const sculptures = {};
  return {
    getWorld(name, create = true) {
      if (!sculptures[name] && create) {
        worlds[name] = factories[name]();
        sculptures[name] = new THREE.Group();
        sculptures[name].add(worlds[name].group);
      }
      return sculptures[name];
    },
    animate(time) { Object.entries(worlds).forEach(([name, world]) => { if (sculptures[name].visible) world.animate(time); }); }
  };
}
