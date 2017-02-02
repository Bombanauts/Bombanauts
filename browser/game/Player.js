import store from '../store'
import socket from '../socket'

import { scene, world, bombObjects } from './main'
import { destroyable, roundFour } from './utils/generateMap'

const THREE = require('three')
const CANNON = require('cannon')
const PointerLockControls = require('./PointerLockControls')

let geometry, material, shape, playerMesh, controls, color, playerBox;

export default class Player {
  constructor(socketId, x, y, z, dead) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.playerMesh = [];
    this.playerBox = [];
    this.socketId = socketId;
    this.dead = dead;

    this.init = this.init.bind(this)
  }

  init() {
    color = '#726591'
    const { id } = this;

    // three
    const halfExtents = new CANNON.Vec3(2, 2, 2);
    const boxShape = new CANNON.Box(halfExtents);
    const boxGeometry = new THREE.BoxGeometry(halfExtents.x * 1.5, halfExtents.y * 1.5, halfExtents.z * 1.5);

    // creating player
    playerBox = new CANNON.Body({ mass: 1 });
    playerBox.addShape(boxShape)
    color = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    playerMesh = new THREE.Mesh(boxGeometry, color);
    playerMesh.name = this.socketId;
    playerBox.name = this.socketId;

    // set spawn position
    playerMesh.position.set(this.x, this.y, this.z);

    playerBox.position.set(playerMesh.position.x, playerMesh.position.y, playerMesh.position.z);

    if (!this.dead) {
      scene.add(playerMesh)
      world.add(playerBox)
    }

    this.playerMesh = playerMesh;
    this.playerBox = playerBox;
  }
}
