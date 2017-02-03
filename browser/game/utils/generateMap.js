import { boxes, boxMeshes, destroyableBoxes, destroyableBoxMeshes } from '../main'
import DestroyableCube from '../Cube'
import Wall from '../Wall'
import FixedCube from '../FixedCube'

const THREE = require('three');
const CANNON = require('cannon');

let  fixedBox = {},
  destroyable = {};

const generateMap = (mapArr) => {
  console.log('MAPARR INSIDE GENERATE MAP: ', mapArr)
  const mapArrWidth = mapArr.length,
    mapArrHeight = mapArr[0].length;

  // CRATE
  const crateTexture = new THREE.TextureLoader().load('images/crate.png');
  const crateMaterial = new THREE.MeshLambertMaterial({ map: crateTexture });

  // WALL
  const wallTexture = new THREE.TextureLoader().load('images/brick_wall.png');
  const wallMaterial = new THREE.MeshLambertMaterial({ map: wallTexture });

  // FIXED CUBE
  const fixedCubeTexture = new THREE.TextureLoader().load('images/stone.png' );
  const fixedCubeMaterial = new THREE.MeshLambertMaterial({ map: fixedCubeTexture });

  // PHYSICS BODY AND SHAPE FOR CRATE, WALL, FIXED CUBE
  const halfExtents = new CANNON.Vec3(2, 2, 2);
  const fixedCubeShape = new CANNON.Box(halfExtents);
  const fixedCubeGeometry = new THREE.BoxGeometry(halfExtents.x * 1.9, halfExtents.y * 1.9, halfExtents.z * 1.9);

  const wallGeometry = new THREE.BoxGeometry(halfExtents.x * 2, halfExtents.y * 3.5, halfExtents.z * 2);

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
      }
      else if (mapArr[j][k] === 1) { // Create Wall
        const wall = new Wall(wallMaterial, wallTexture, fixedCubeShape, wallGeometry, x, y, z);
        wall.init();
        boxes.push(wall.wallBody);
        boxMeshes.push(wall.wallMesh);
      }
      else if (mapArr[j][k] === 3) { //DESTROYABLE BOX
        const destroyableBox = new DestroyableCube(crateMaterial, crateTexture, fixedCubeShape, fixedCubeGeometry, x, y, z, j, k);
        destroyableBox.init();
        destroyableBoxes.push(destroyableBox.cubeBox);
        destroyableBoxMeshes.push(destroyableBox.cubeMesh);
        destroyable[`${x}_${z}`] = [true, destroyableBox]
      }
      else if (mapArr[j][k] === 0) { // Grass
        destroyable[`${x}_${z}`] = true
      }
    }
  }
}

const roundFour = (num) => {
  return Math.round(num / 4) * 4
}

export default generateMap;
export { fixedBox, destroyable, roundFour }
