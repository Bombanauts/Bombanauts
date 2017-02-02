import { boxes, boxMeshes, destroyableBoxes, destroyableBoxMeshes } from '../main'
import DestroyableCube from '../Cube'
import Wall from '../Wall'
import FixedCube from '../FixedCube'

const boundary = {},
  fixedBox = {},
  destroyable = {};

const generateMap = (mapArr) => {
  const mapArrWidth = mapArr.length,
    mapArrHeight = mapArr[0].length;

  for (let j = 0; j < mapArrWidth; j++) {
    for (let k = 0; k < mapArrHeight; k++) {
      const x = (j + mapArrWidth) * 4 - 100;
      const y = 2
      const z = -(k + mapArrWidth) * 4 + 100;

      if (mapArr[j][k] === 2) { // Create Box
        const fixedCube = new FixedCube(x, y, z);
        boxes.push(fixedCube.fixedCubeBody);
        boxMeshes.push(fixedCube.fixedCubeMesh);
      }
      else if (mapArr[j][k] === 1) { // Create Wall
        const wall = new Wall(x, y, z);
        boxes.push(wall.wallBody);
        boxMeshes.push(wall.wallMesh);
      }
      else if (mapArr[j][k] === 3) { //DESTROYABLE BOX
          let destroyableBox = new DestroyableCube(x, y, z);
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
export { boundary, fixedBox, destroyable, roundFour }
