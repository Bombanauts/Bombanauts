import store from '../store'
import socket from '../socket'

const THREE = require('three')
const CANNON = require('cannon')
const PointerLockControls = require('./PointerLockControls')

import { scene, world } from './main';

export default class Wall {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.wallMesh = {};
    this.wallBody = {};
    this.init();
    }

    init() {
    const halfExtents = new CANNON.Vec3(2, 4, 2);
    const wallShape = new CANNON.Box(halfExtents);
    const wallGeometry = new THREE.BoxGeometry(halfExtents.x * 2, halfExtents.y * 2, halfExtents.z * 2);

    //importing texture
    const texture = new THREE.TextureLoader().load('images/brick_wall.png');

    // creating wall
    const wallBody = new CANNON.Body({ mass: 0 });
    wallBody.addShape(wallShape)
    const material = new THREE.MeshLambertMaterial({ map: texture });
    const wallMesh = new THREE.Mesh( wallGeometry, material );

    // set spawn position
    wallMesh.position.set(this.x, this.y, this.z);
    wallBody.position.set(this.x, this.y, this.z);

    scene.add(wallMesh)
    world.add(wallBody)

    this.wallMesh = wallMesh;
    this.wallBody = wallBody;
  }
}
