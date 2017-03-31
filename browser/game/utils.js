import * as THREE from 'three'
import * as CANNON from 'cannon'

import {
  boxes,
  boxMeshes,
  sphereBody
} from './main'

import socket from '../socket'

import { killPlayer } from '../redux/dead/action-creator'
import store from '../redux/store'

import DestroyableCube from './Cube'
import Wall from './Wall'
import FixedCube from './FixedCube'

import { VolumetricFire } from './ParticleEngine'

export const boundary = {}
export const fixedBox = {}
export let destroyable;

export const generateMap = (mapArr) => {
  destroyable = null;
  destroyable = {};

  const mapArrWidth = mapArr.length,
    mapArrHeight = mapArr[0].length;

  /*----- CRATE -----*/
  const crateTexture = new THREE.TextureLoader().load('images/crate.png');
  const crateMaterial = new THREE.MeshLambertMaterial({ map: crateTexture });

  //*----- WALL -----*/
  const wallTexture = new THREE.TextureLoader().load('images/brick.png');
  const wallMaterial = new THREE.MeshLambertMaterial({ map: wallTexture });

  /*----- FIXED CUBE -----*/
  const fixedCubeTexture = new THREE.TextureLoader().load('images/Tileable1b.png');
  const fixedCubeMaterial = new THREE.MeshLambertMaterial({ map: fixedCubeTexture });

  /* PHYSICS BODY & SHAPE FOR CRATE, WALL, & FIXED CUBE */
  const halfExtents = new CANNON.Vec3(2, 10, 2);
  const fixedCubeShape = new CANNON.Box(halfExtents);
  const fixedCubeGeometry = new THREE.BoxGeometry(halfExtents.x * 1.9, 3.8, halfExtents.z * 1.9);

  const wallGeometry = new THREE.BoxGeometry(halfExtents.x * 2, 6, halfExtents.z * 2);

  for (let j = 0; j < mapArrWidth; j++) {
    for (let k = 0; k < mapArrHeight; k++) {
      const x = (j + mapArrWidth) * 4 - 100;
      const y = 2
      const z = -(k + mapArrWidth) * 4 + 100;

      if (mapArr[j][k] === 2) { // CREATE BOX
        const fixedCube = new FixedCube(fixedCubeMaterial, fixedCubeTexture, fixedCubeShape, fixedCubeGeometry, x, y, z);
        fixedCube.init()
        boxes.push(fixedCube.fixedCubeBody);
        boxMeshes.push(fixedCube.fixedCubeMesh);
      } else if (mapArr[j][k] === 1) { // CREATE WALL
        const wall = new Wall(wallMaterial, wallTexture, fixedCubeShape, wallGeometry, x, y, z);
        wall.init();
        boxes.push(wall.wallBody);
        boxMeshes.push(wall.wallMesh);
      } else if (mapArr[j][k] === 3) { //DESTROYABLE BOX
        const destroyableBox = new DestroyableCube(crateMaterial, crateTexture, fixedCubeShape, fixedCubeGeometry, x, y, z, j, k);
        destroyableBox.init();
        boxes.push(destroyableBox.cubeBox);
        boxMeshes.push(destroyableBox.cubeMesh);
        destroyable[`${x}_${z}`] = [true, destroyableBox]
      } else if (mapArr[j][k] === 0) { // GRASS
        destroyable[`${x}_${z}`] = true
      }
    }
  }
}

export const createMap = () => {
  let map = store.getState().map
  generateMap(map);
}

export const roundFour = (num) => {
  return Math.round(num / 4) * 4
}

export const animateFire = (bombObjects, clock, dead) => {
  let elapsed = clock.getElapsedTime()

  /*----- HELPER FUNCTION FOR ANIMATING FIRE -----*/
  const animateSingleFire = (fire, bombUserId) => {
    if (fire) {
      fire.update(elapsed)
      if (fire.mesh.position.x === roundFour(sphereBody.position.x) &&
        fire.mesh.position.z === roundFour(sphereBody.position.z)) {
        if (!dead) {
          dead = true;
          socket.emit('kill_player', {
            id: socket.id,
            killedBy: bombUserId
          })
          store.dispatch(killPlayer())
        }
      }
    }
  }

  /* RUNNING ANIMATE SINGLE FIRE FOR EVERY SQUARE AROUND BOMB */
  for (let i = 0; i < bombObjects.length; i++) {
    if (bombObjects[i].bool) {
      let fire = 'fire'
      for (let k = 1; k <= 5; k++) {
        let currentFire = fire;
        if (k !== 1) {
          currentFire += k
        }
        animateSingleFire(bombObjects[i][currentFire], bombObjects[i].userId)
      }
    }
  }

  return dead;
}

export const animatePlayers = (players, playerIds, others, playerMeshes) => {
  for (let i = 0; i < players.length; i++) {
    if (others[playerIds[i]] && !others[playerIds[i]].dead) {
      let { x, y, z } = others[playerIds[i]]
      playerMeshes[i].position.set(x, y, z);
      // // if(playerMeshes[i].sprite) {
      //   playerMeshes[i].sprite.position.set(x, y + 2.25, z);
      // }
      players[i].position.x = x;
      players[i].position.y = y;
      players[i].position.z = z;
    }
  }
}

export const animateExplosion = (blocksObj) => {
  for (let block in blocksObj) {
    if (blocksObj[block].length) {
      for (let i = 0; i < blocksObj[block].length; i++) {
        blocksObj[block][i].loop(block);
      }
    } else {
      delete blocksObj[block]
    }
  }
}

export const animateBombs = (yourBombs, yourBombMeshes, bombs, stateBombs, bombMeshes, prevStateLength) => {
  let indexAdd = bombs.length - stateBombs.length;

  for (let i = 0; i < prevStateLength; i++) {
    let { x, y, z } = stateBombs[i].position
    bombs[i + indexAdd].position.x = x;
    bombs[i + indexAdd].position.y = y;
    bombs[i + indexAdd].position.z = z;
    bombMeshes[i + indexAdd].position.copy(bombs[i + indexAdd].position)
  }

  for (let i = 0; i < yourBombs.length; i++) {
    yourBombMeshes[i].position.copy(yourBombs[i].position)
  }
}

export const deleteWorld = (scene, world, boxMeshes, boxes, bombs, bombMeshes, yourBombs, bombObjects, yourBombMeshes, players, playerMeshes) => {
  for (let i = 0; i < boxMeshes.length; i++) {
    scene.remove(boxMeshes[i]);
  }
  for (let i = 0; i < boxes.length; i++) {
    world.remove(boxes[i]);
  }
  for (let i = 0; i < bombs.length; i++) {
    world.remove(bombs[i])
  }
  for (let i = 0; i < bombMeshes.length; i++) {
    scene.remove(bombMeshes[i])
  }
  for (let i = 0; i < bombObjects.length; i++) {
    if (bombObjects[i].clearTimeout) clearTimeout(bombObjects[i].clearTimeout)
    if (bombObjects[i].bombBody) world.remove(bombObjects[i].bombBody)
  }
  for (let i = 0; i < yourBombMeshes.length; i++) {
    scene.remove(yourBombMeshes[i])
  }
  for (let i = 0; i < playerMeshes.length; i++) {
    scene.remove(playerMeshes[i]);
  }
  for (let i = 0; i < players.length; i++) {
    world.remove(players[i]);
  }
}

export const getShootDir = (projector, camera, targetVec) => {
  const vector = targetVec;
  targetVec.set(0, 0, 1);
  projector.unprojectVector(vector, camera);
  const ray = new THREE.Ray(sphereBody.position, vector.sub(sphereBody.position).normalize());
  targetVec.copy(ray.direction);
}

export const delay = (time) => {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

export const destroyBoxForEveryone = (destroyableArea, location) => {
  if (destroyableArea[location].length) {
    if (destroyable[location][1].explode()) {
      socket.emit('destroy_cube', {
        j: destroyable[location][1].j,
        k: destroyable[location][1].k
      })
    }
  }
}

export const createFire = (scene, camera, x, y, z) => {
  VolumetricFire.texturePath = '../../public/assets/images'
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

// CREATING TEXT SPRITE FOR PLAYER
// export const makeTextSprite = (message, fontsize) => {
//   let ctx, texture, sprite, spriteMaterial,
//       canvas = document.createElement('canvas');

//   ctx = canvas.getContext('2d');

//   let metrics = ctx.measureText(message);
//   let textWidth = metrics.width;

//   ctx.textAlign = 'center';
//   ctx.textBaseline = 'middle';

//   ctx.font = 'Bold ' + fontsize + 'px Helvetica';
//   ctx.fillStyle = 'rgba(255,255,255,1)';
//   ctx.fillText(message, canvas.width / 2, fontsize);

//   texture = new THREE.Texture(canvas);
//   texture.minFilter = THREE.LinearFilter; // NearestFilter;
//   texture.needsUpdate = true;

//   spriteMaterial = new THREE.SpriteMaterial({ map: texture });
//   sprite = new THREE.Sprite(spriteMaterial);
//   return sprite;
// };
