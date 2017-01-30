import store from '../store'
import socket from '../socket'

const THREE = require('three')
const CANNON = require('cannon')
const PointerLockControls = require('./PointerLockControls')

import { scene, world } from './main';

export default class FixedCube {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.fixedCubeMesh = {};
    this.fixedCubeBody = {};
    this.init()
    }

    init() {
    let halfExtents = new CANNON.Vec3(2,2,2);
    let fixedCubeShape = new CANNON.Box(halfExtents);
    let fixedCubeGeometry = new THREE.BoxGeometry(halfExtents.x * 1.9, halfExtents.y * 1.9, halfExtents.z * 1.9);

    //importing texture
    const texture = new THREE.TextureLoader().load('images/crate.gif' );

    // creating fixedCube
    let fixedCubeBody = new CANNON.Body({ mass: 0 });
    fixedCubeBody.addShape(fixedCubeShape)
    let material = new THREE.MeshLambertMaterial({ map: texture });
    let fixedCubeMesh = new THREE.Mesh( fixedCubeGeometry, material );

    // set spawn position
    fixedCubeMesh.position.set(this.x, this.y, this.z);

    fixedCubeBody.position.set(fixedCubeMesh.position.x, fixedCubeMesh.position.y, fixedCubeMesh.position.z);

    scene.add(fixedCubeMesh)
    world.add(fixedCubeBody)

    this.fixedCubeMesh = fixedCubeMesh;
    this.fixedCubeBody = fixedCubeBody;
  }
}
