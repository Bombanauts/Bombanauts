import { boxes, boxMeshes, bombObjects, sphereBody } from './main'
import socket from '../socket'
import { killPlayer } from '../dead/action-creator'
import store from '../store'
import DestroyableCube from './Cube'
import Wall from './Wall'
import FixedCube from './FixedCube'

const THREE = require('three');
const CANNON = require('cannon');

export const boundary = {}
export const fixedBox = {}
export let destroyable;

export const generateMap = (mapArr) => {
  destroyable = null;
  destroyable = {};

  const mapArrWidth = mapArr.length,
    mapArrHeight = mapArr[0].length;

  // CRATE
  const crateTexture = new THREE.TextureLoader().load('images/crate.png');
  const crateMaterial = new THREE.MeshLambertMaterial({ map: crateTexture });

  // WALL
  const wallTexture = new THREE.TextureLoader().load('images/brick_wall.png');
  const wallMaterial = new THREE.MeshLambertMaterial({ map: wallTexture });

  // FIXED CUBE
  const fixedCubeTexture = new THREE.TextureLoader().load('images/stone.png');
  const fixedCubeMaterial = new THREE.MeshLambertMaterial({ map: fixedCubeTexture });

  // PHYSICS BODY AND SHAPE FOR CRATE, WALL, FIXED CUBE
  const halfExtents = new CANNON.Vec3(2, 10, 2);
  const fixedCubeShape = new CANNON.Box(halfExtents);
  const fixedCubeGeometry = new THREE.BoxGeometry(halfExtents.x * 1.9, 3.8, halfExtents.z * 1.9);

  const wallGeometry = new THREE.BoxGeometry(halfExtents.x * 2, 6, halfExtents.z * 2);

  for (let j = 0; j < mapArrWidth; j++) {
    for (let k = 0; k < mapArrHeight; k++) {
      const x = (j + mapArrWidth) * 4 - 100;
      const y = 2
      const z = -(k + mapArrWidth) * 4 + 100;

      if (mapArr[j][k] === 2) { // Create Box
        const fixedCube = new FixedCube(fixedCubeMaterial, fixedCubeTexture, fixedCubeShape, fixedCubeGeometry, x, y, z);
        fixedCube.init()
        boxes.push(fixedCube.fixedCubeBody);
        boxMeshes.push(fixedCube.fixedCubeMesh);
      } else if (mapArr[j][k] === 1) { // Create Wall
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
      } else if (mapArr[j][k] === 0) { // Grass
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

export const animateFire = (bombObjects, clock) => {
  let isDead = false
  let elapsed = clock.getElapsedTime()
  for (let i = 0; i < bombObjects.length; i++) {
    const bomb = bombObjects[i]

    const playerPositionX = roundFour(sphereBody.position.x)
    const playerPositionZ = roundFour(sphereBody.position.z)

    if (bomb.bool) {
      if (bomb.fire) {
        bomb.fire.update(elapsed)
        const firePositionX = bomb.fire.mesh.position.x
        const firePositionZ = bomb.fire.mesh.position.z

        if (firePositionX === playerPositionX &&
          firePositionZ === playerPositionZ) {
          isDead = true;
          socket.emit('kill_player', {
            id: socket.id
          })
          store.dispatch(killPlayer())
        }
      }

      if (bomb.fire2) {
        bomb.fire2.update(elapsed)
        const fire2PositionX = bomb.fire2.mesh.position.x
        const fire2PositionZ = bomb.fire2.mesh.position.z

        if (fire2PositionX === playerPositionX &&
          fire2PositionZ === playerPositionZ) {
          isDead = true;
          socket.emit('kill_player', {
            id: socket.id
          })
          store.dispatch(killPlayer())
        }
      }

      if (bomb.fire3) {
        bomb.fire3.update(elapsed)
        const fire3PositionX = bomb.fire3.mesh.position.x
        const fire3PositionZ = bomb.fire3.mesh.position.z

        if (fire3PositionX === playerPositionX &&
          fire3PositionZ === playerPositionZ) {
          isDead = true;
          socket.emit('kill_player', {
            id: socket.id
          })
          store.dispatch(killPlayer())
        }
      }

      if (bomb.fire4) {
        bomb.fire4.update(elapsed)
        const fire4PositionX = bomb.fire4.mesh.position.x
        const fire4PositionZ = bomb.fire4.mesh.position.z

        if (fire4PositionX === playerPositionX &&
          fire4PositionZ === playerPositionZ) {
          isDead = true;
          socket.emit('kill_player', {
            id: socket.id
          })
          store.dispatch(killPlayer())
        }
      }

      if (bomb.fire5) {
        bomb.fire5.update(elapsed)
        const fire5PositionX = bomb.fire5.mesh.position.x
        const fire5PositionZ = bomb.fire5.mesh.position.z

        if (fire5PositionX === playerPositionX &&
          fire5PositionZ === playerPositionZ) {
          isDead = true;
          socket.emit('kill_player', {
            id: socket.id
          })
          store.dispatch(killPlayer())
        }
      }
    }
  }
  return isDead;
}

export const animatePlayers = (players, playerIds, others, playerMeshes) => {
  for (let i = 0; i < players.length; i++) {
    if (others[playerIds[i]] && !others[playerIds[i]].dead) {
      let { x, y, z } = others[playerIds[i]]
      playerMeshes[i].position.set(x, y, z);
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

export const deleteWorld = (scene, world, boxMeshes, boxes, bombs, bombMeshes, yourBombs, bombObjects, yourBombMeshes) => {
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
}


export const getShootDir = (projector, camera, targetVec) => {
  const vector = targetVec;
  targetVec.set(0, 0, 1);
  projector.unprojectVector(vector, camera);
  const ray = new THREE.Ray(sphereBody.position, vector.sub(sphereBody.position).normalize());
  targetVec.copy(ray.direction);
}