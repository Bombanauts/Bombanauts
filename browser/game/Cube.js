import store from '../store'
import socket from '../socket'

const THREE = require('three')
const CANNON = require('cannon')
const PointerLockControls = require('./PointerLockControls')

import { scene, world, blockCount, blocksArr} from './main';

import { Particle, Block } from './Explosion.js';


export default class DestroyableCube {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.destroyed = false;
    this.cubeMesh = {};
    this.cubeBox = {};
    this.init();
  }

  init() {
    let particles = []

    let halfExtents = new CANNON.Vec3(2,2,2);
    let boxShape = new CANNON.Box(halfExtents);
    let boxGeometry = new THREE.BoxGeometry(halfExtents.x*1.9,halfExtents.y*1.9,halfExtents.z*1.9);

    // creating player
    let cubeBox = new CANNON.Body({ mass: 1 });
    cubeBox.addShape(boxShape)
    let color = new THREE.MeshLambertMaterial( { color: 0x8B4513 } );
    let cubeMesh = new THREE.Mesh( boxGeometry, color );

    // set spawn position
    cubeMesh.position.set(this.x, this.y, this.z);
    cubeBox.position.set(cubeMesh.position.x, cubeMesh.position.y, cubeMesh.position.z);

    scene.add(cubeMesh)
    world.add(cubeBox)
    for (var i = 0; i < blockCount; i++) {
      var block = new Block(scene, world, {x: this.x, y: this.y, z: this.z});
      particles.push(block);
    }

    this.cubeMesh = cubeMesh;
    this.cubeBox = cubeBox;
    blocksArr.push(particles.slice());

  }
}
