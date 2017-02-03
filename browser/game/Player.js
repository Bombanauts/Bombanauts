import store from '../store'
import socket from '../socket'

import { scene, world, bombObjects, blockCount, blocksObj } from './main'
import { destroyable, roundFour } from './utils/generateMap'
import { Block } from './Explosion'

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
    this.material;

    this.init = this.init.bind(this)
  }

  init() {
    // color = '#726591'
    const { id } = this;

    // three
    const halfExtents = new CANNON.Vec3(2, 2, 2);
    const boxShape = new CANNON.Box(halfExtents);
    const boxGeometry = new THREE.BoxGeometry(halfExtents.x * 1.5, halfExtents.y * 1.5, halfExtents.z * 1.5);

     let texture = new THREE.TextureLoader().load('images/creeperface.jpg' );
    // creating player
    playerBox = new CANNON.Body({ mass: 0 });
    playerBox.addShape(boxShape)
    this.material = new THREE.MeshLambertMaterial({ map: texture });
    playerMesh = new THREE.Mesh(boxGeometry, this.material);
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

  explode () {
    if (!this.dead) {
      const boxParticleGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4)
      const particles = [];
      for (let i = 0; i < blockCount; i++) {
        const player = new Block(scene, world, {x: this.x, y: this.y, z: this.z}, 'player', boxParticleGeometry, this.material);
        particles.push(player);
      }
      console.log('PLAYER MESH ID', this.playerMesh.id)
      blocksObj[this.playerMesh.id] = particles.slice();
      world.remove(this.playerBox)
      scene.remove(this.playerMesh)
      this.dead = true;
      return true; //returning for knowing if socket should emit on explosion call
    }
  }
}
