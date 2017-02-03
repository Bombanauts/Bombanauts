
const THREE = require('three')
const CANNON = require('cannon')

import { scene, world, blockCount, blocksObj } from './main';

import { Block } from './Explosion.js';

export default class DestroyableCube {
  constructor(material, texture, fixedCubeShape, fixedCubeGeometry, x, y, z, j, k) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.j = j;
    this.k = k;
    this.exploded = false;
    this.cubeMesh = {};
    this.cubeBox = {};
    this.material = material;
    this.texture = texture;
    this.fixedCubeShape = fixedCubeShape;
    this.fixedCubeGeometry = fixedCubeGeometry
  }

  init() {
    // creating player
    const cubeBox = new CANNON.Body({ mass: 0 });
    cubeBox.addShape(this.fixedCubeShape)
    const cubeMesh = new THREE.Mesh(this.fixedCubeGeometry, this.material);

    // set spawn position
    cubeMesh.position.set(this.x, this.y, this.z);
    cubeBox.position.set(cubeMesh.position.x, cubeMesh.position.y, cubeMesh.position.z);

    scene.add(cubeMesh)
    world.add(cubeBox)

    this.cubeMesh = cubeMesh;
    this.cubeBox = cubeBox;
  }

  explode () {
    if (!this.exploded) {
      const boxParticleGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4)
      const particles = [];
      for (let i = 0; i < blockCount; i++) {
        const block = new Block(scene, world, {x: this.x, y: this.y, z: this.z}, 'cube', boxParticleGeometry, this.material);
        particles.push(block);
      }
      blocksObj[this.cubeMesh.id] = particles.slice();
      world.remove(this.cubeBox)
      scene.remove(this.cubeMesh)
      this.exploded = true;
      return true; //returning for knowing if socket should emit on explosion call
    }
  }
}
