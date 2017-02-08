import socket from '../socket'

const THREE = require('three')
const CANNON = require('cannon')

import { scene, world, camera, blockCount, blocksObj, listener } from './main'
import { VolumetricFire } from './ParticleEngine';
import { destroyable, roundFour } from './utils'
import { Block } from './Explosion.js'

export default class Bomb {
  constructor(id, position, material, userId) {
    this.id = id;
    this.userId = userId;
    this.position = position;
    this.bool = true;
    this.clearTimeout = null;
    this.material = material;
    this.bombMesh;
    this.bombBody;
    this.bombShape;
    this.fire;
    this.fire2;
    this.fire3;
    this.fire4;
    this.fire5;

    this.init = this.init.bind(this);
    this.explode = this.explode.bind(this);
  }

  init() {
    let explosionSound = new THREE.PositionalAudio( listener );
    const explosionLoader = new THREE.AudioLoader();
    explosionLoader.load( 'sounds/explosion.mp3', function( buffer ) {
      explosionSound.setBuffer( buffer );
      explosionSound.setRefDistance( 10 );
      explosionSound.play()
    });

    this.bombShape = new CANNON.Sphere(1.5);

    let bombGeometry = new THREE.SphereGeometry(this.bombShape.radius, 32, 32);

    // create the bomb
    this.bombBody = new CANNON.Body({ mass: 10});
    this.bombBody.addShape(this.bombShape);
    this.bombMesh = new THREE.Mesh(bombGeometry, this.material);

    // add it to the scene
    world.addBody(this.bombBody);
    scene.add(this.bombMesh);

    let colorBool = false;

    let clear;
    setTimeout(() => {
      clear = setInterval(() => {
      if (!colorBool) this.bombMesh.material.color.setHex(0x510000)
      else if (colorBool) this.bombMesh.material.color.setHex(0x000000)
      colorBool = !colorBool;
    }, 100)}, 800)

    this.clearTimeout = setTimeout(() => {
      this.explode()
      clearInterval(clear)
      this.bombMesh.material.color.setHex(0x000000)
    }, 1700)
  }

  explode() {
    const x = roundFour(this.bombBody.position.x)
    const y = this.bombBody.position.y + 4
    const z = roundFour(this.bombBody.position.z)

    const bombParticleGeometry = new THREE.SphereGeometry(0.2, 0.2, 0.2)

    const particles = [];
    for (let i = 0; i < blockCount; i++) {
      const bomb = new Block(scene, world, { x: x, y: y, z: z }, 'bomb', bombParticleGeometry, this.material)
      particles.push(bomb);
    }
    blocksObj[this.bombMesh.id] = particles.slice()

    // removes from three js and cannon js
    scene.remove(this.bombMesh)
    world.remove(this.bombBody)

    // create Fire

    function createFire(x, y, z) {
      const fireWidth = 4
      const fireHeight = 12
      const fireDepth = 4
      const sliceSpacing = 0.5
      const fire = new VolumetricFire(fireWidth, fireHeight, fireDepth, sliceSpacing, camera)
      fire.mesh.frustumCulled = false;
      fire.mesh.position.set(x, y, z)
      scene.add(fire.mesh)
      return fire
    }

    const middle = `${x}_${z}`;
    const right = `${x + 4}_${z}`;
    const left = `${x - 4}_${z}`;
    const top = `${x}_${z + 4}`;
    const bottom = `${x}_${z - 4}`;

    if (destroyable[middle]) {
      this.fire = createFire(x, y, z)
      if (destroyable[middle].length) {
        if (destroyable[middle][1].explode()) {
          socket.emit('destroy_cube', {
            j: destroyable[middle][1].j,
            k: destroyable[middle][1].k
          })
        }
      }
    }

    if (destroyable[right]) {
      this.fire2 = createFire(x + 4, y, z)
      if (destroyable[right].length) {
        if (destroyable[right][1].explode()) {
          socket.emit('destroy_cube', {
            j: destroyable[right][1].j,
            k: destroyable[right][1].k
          })
        }
      }
    }

    if (destroyable[left]) {
      this.fire3 = createFire(x - 4, y, z)
      if (destroyable[left].length) {
        if (destroyable[left][1].explode()) {
          socket.emit('destroy_cube', {
            j: destroyable[left][1].j,
            k: destroyable[left][1].k
          })
        }
      }
    }

    if (destroyable[top]) {
      this.fire4 = createFire(x, y, z + 4)
      if (destroyable[top].length) {
       if (destroyable[top][1].explode()) {
        socket.emit('destroy_cube', {
          j: destroyable[top][1].j,
          k: destroyable[top][1].k
        })
       }
      }
    }

    if (destroyable[bottom]) {
      this.fire5 = createFire(x, y, z - 4)
      if (destroyable[bottom].length) {
        if (destroyable[bottom][1].explode()) {
          socket.emit('destroy_cube', {
            j: destroyable[bottom][1].j,
            k: destroyable[bottom][1].k
          })
        }
      }
    }

    VolumetricFire.texturePath = '../../public/assets/images';

    setTimeout(() => {
      if (this.fire) scene.remove(this.fire.mesh)
      if (this.fire2) scene.remove(this.fire2.mesh)
      if (this.fire3) scene.remove(this.fire3.mesh)
      if (this.fire4) scene.remove(this.fire4.mesh)
      if (this.fire5) scene.remove(this.fire5.mesh)
      this.fire = null;
      this.fire2 = null;
      this.fire3 = null;
      this.fire4 = null;
      this.fire5 = null;

      //to speed up the animation function
      this.bool = false;
    }, 1000)
  }
}

export { Bomb }
