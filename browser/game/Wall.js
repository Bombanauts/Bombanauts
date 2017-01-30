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
    let halfExtents = new CANNON.Vec3(2,2,2);
    let wallShape = new CANNON.Box(halfExtents);  // Again a bit of confusion regarding the comment divisions
    let wallGeometry = new THREE.BoxGeometry(halfExtents.x * 2, halfExtents.y * 3.5, halfExtents.z * 2);

    // creating wall
    let wallBody = new CANNON.Body({ mass: 0 });
    wallBody.addShape(wallShape)
    let color = new THREE.MeshLambertMaterial({ color: 0x3f7cba });
    let wallMesh = new THREE.Mesh( wallGeometry, color );

    // set spawn position
    wallMesh.position.set(this.x, this.y, this.z);

    wallBody.position.set(wallMesh.position.x, wallMesh.position.y, wallMesh.position.z);

    scene.add(wallMesh)
    world.add(wallBody)

    this.wallMesh = wallMesh;
    this.wallBody = wallBody;
  }
}
