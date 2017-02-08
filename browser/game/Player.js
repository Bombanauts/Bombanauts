import store from '../store'
import socket from '../socket'

import { scene, world, bombObjects, blockCount, blocksObj, listener, camera } from './main'
import { destroyable, roundFour, makeTextSprite } from './utils'
import { Block } from './Explosion'

const THREE = require('three')
const CANNON = require('cannon')
const PointerLockControls = require('./PointerLockControls')

let geometry, material, shape, playerMesh, controls, color, playerBox, name, sprite;
export default class Player {
  constructor(socketId, x, y, z, dead) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.playerMesh = [];
    this.playerBox = [];
    this.socketId = socketId;
    this.nickname = store.getState().players[socketId].nickname;
    this.dead = dead;
    this.material;
    this.sprite;

    this.init = this.init.bind(this)
  }

  init() {
    const halfExtents = new CANNON.Vec3(2, 2, 2);
    const boxShape = new CANNON.Box(halfExtents);
    const boxGeometry = new THREE.BoxGeometry(halfExtents.x * 1.5, halfExtents.y * 1.5, halfExtents.z * 1.5);

    let face = new THREE.TextureLoader().load('images/creeperface.jpg');
    let body = new THREE.TextureLoader().load('images/creeperbody.jpg');
    let textureFace = new THREE.MeshLambertMaterial({ map: face });
    let textureBody = new THREE.MeshLambertMaterial({ map: body });

    const materials = [
      textureFace,
      textureFace,
      textureBody,
      textureBody,
      textureFace,
      textureFace
    ]

    // creating player
    playerBox = new CANNON.Body({ mass: 0 });
    playerBox.addShape(boxShape)
    this.material = new THREE.MultiMaterial(materials)
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

    // ASSIGNING NICKNAME SPRITE TO PLAYER
    if (this.nickname) {
      name = this.nickname.length > 8 ? this.nickname.slice(0, 7) : this.nickname;
      sprite = makeTextSprite(name, 100);
      sprite.position.set(this.x, this.y + 2.25, this.z)
      this.playerMesh.sprite = sprite;
      sprite.lookAt(camera.position)
      this.sprite = sprite;
      scene.add(this.sprite);   
    }

  }

  explode() {
    if (!this.dead) {
      const boxParticleGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4)
      const particles = [];
      for (let i = 0; i < blockCount; i++) {
        const player = new Block(scene, world, { x: this.x, y: this.y, z: this.z }, 'player', boxParticleGeometry, this.material);
        particles.push(player);
      }
      blocksObj[this.playerMesh.id] = particles.slice();
      world.remove(this.playerBox)
      scene.remove(this.playerMesh)
      scene.remove(this.sprite)
      this.dead = true;
      return true; //returning for knowing if socket should emit on explosion call
    }
  }
}
