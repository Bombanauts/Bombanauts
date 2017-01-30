import store from '../store'
import socket from '../socket'

const THREE = require('three')
const CANNON = require('cannon')
const PointerLockControls = require('./PointerLockControls')

import { scene, world } from './main';

export default class DestroyableCube {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.cubeMesh = {};
    this.cubeBox = {};
    this.init();
  }

  init() {
    const halfExtents = new CANNON.Vec3(2, 2, 2);
    const boxShape = new CANNON.Box(halfExtents);
    const boxGeometry = new THREE.BoxGeometry(halfExtents.x * 1.9, halfExtents.y * 1.9, halfExtents.z * 1.9);

    //importing texture
    const texture = new THREE.TextureLoader().load('images/crate.gif');

    // creating player
    const cubeBox = new CANNON.Body({ mass: 1 });
    cubeBox.addShape(boxShape)
    const material = new THREE.MeshLambertMaterial({ map: texture });
    const cubeMesh = new THREE.Mesh(boxGeometry, material);

    // set spawn position
    cubeMesh.position.set(this.x, this.y, this.z);

    cubeBox.position.set(cubeMesh.position.x, cubeMesh.position.y, cubeMesh.position.z);

    scene.add(cubeMesh)
    world.add(cubeBox)

    this.cubeMesh = cubeMesh;
    this.cubeBox = cubeBox;
  }
}
