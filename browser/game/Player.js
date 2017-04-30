import * as THREE from 'three';
import * as CANNON from 'cannon';

import store from '../redux/store';
import { scene, world, blockCount, blocksObj } from './main';
import { Block } from './Explosion';

let sprite;

export default class Player {
  constructor(socketId, x, y, z, dead, nickname) {
    this.socketId = socketId;
    this.x = x;
    this.y = y;
    this.z = z;
    this.dead = dead;
    this.nickname = store.getState().players[socketId].nickname;
    this.material;
    this.playerMesh;
    this.playerBox;
    this.sprite;
  }

  init() {
    const halfExtents = new CANNON.Vec3(2, 2, 2);
    const boxShape = new CANNON.Box(halfExtents);
    const boxGeometry = new THREE.BoxGeometry(halfExtents.x * 1.5, halfExtents.y * 1.5, halfExtents.z * 1.5);

    const face = new THREE.TextureLoader().load('images/creeperface.jpg');
    const body = new THREE.TextureLoader().load('images/creeperbody.jpg');
    const textureFace = new THREE.MeshLambertMaterial({ map: face });
    const textureBody = new THREE.MeshLambertMaterial({ map: body });

    const materials = [
      textureFace,
      textureFace,
      textureBody,
      textureBody,
      textureFace,
      textureFace
    ];

    /*----- CREATE PLAYER -----*/
    const playerBox = new CANNON.Body({ mass: 0 });
    playerBox.addShape(boxShape);
    playerBox.name = this.socketId;

    this.material = new THREE.MultiMaterial(materials);
    const playerMesh = new THREE.Mesh(boxGeometry, this.material);
    playerMesh.name = this.socketId;

    /*----- SET SPAWN POSITION -----*/
    playerMesh.position.set(this.x, this.y, this.z);
    playerBox.position.set(playerMesh.position.x, playerMesh.position.y, playerMesh.position.z);

    /*----- ADD MESH & BODY TO WORLD & SCENE -----*/
    if (!this.dead) {
      scene.add(playerMesh);
      world.add(playerBox);
    }

    this.playerMesh = playerMesh;
    this.playerBox = playerBox;
  }

  explode() {
    if (!this.dead) {
      const boxParticleGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
      const particles = [];
      for (let i = 0; i < blockCount; i++) {
        const player = new Block(scene, world, { x: this.x, y: this.y, z: this.z }, 'player', boxParticleGeometry, this.material);
        particles.push(player);
      }
      blocksObj[this.playerMesh.id] = particles.slice();
      world.remove(this.playerBox);
      scene.remove(this.playerMesh);

      this.dead = true;

      /*----- RETURNS IF SOCKET SHOULD EMIT ON EXPLOSION CALL -----*/
      return true;
    }
  }
}

export { sprite };
