import {boxes, boxMeshes, destroyableBoxes, destroyableBoxMeshes} from '../main'
import DestroyableCube from '../Cube'
import Wall from '../Wall'
import FixedCube from '../FixedCube'

let boundary = {}, fixedBox = {}, grass ={};

const generateMap = (mapArr) => {
  let mapArrWidth = mapArr.length,
    mapArrHeight = mapArr[0].length;

  for (let j = 0; j < mapArrWidth; j++) {
    for (let k = 0; k < mapArrHeight; k++) {

      let x = (j + mapArrWidth) * 4 - 100;
      let y = 2
      let z = -(k + mapArrWidth) * 4 + 100;

      if (mapArr[j][k] === 2) { // create box

        let fixedCube = new FixedCube(x, y, z);
        boxes.push(fixedCube.fixedCubeBody);
        boxMeshes.push(fixedCube.fixedCubeMesh);

        // fixedBox[`${x}_${z}`] = true

      } else if (mapArr[j][k] === 1) { // create wall
        let wall = new Wall(x, y, z);
        boxes.push(wall.wallBody);
        boxMeshes.push(wall.wallMesh);

        // boundary[`${x}_${z}`] = true

      } else if (mapArr[j][k] === 3) { //DESTROYABLE BOX
        let destroyableBox = new DestroyableCube(x, y, z);
        destroyableBoxes.push(destroyableBox.cubeBox);
        destroyableBoxMeshes.push(destroyableBox.cubeMesh);

      } else {
        grass[`${x}_${z}`] = true
      }

    }
  }
}

const roundFour = (num) => {
  return Math.round(num/4) * 4
}

export default generateMap;
export { boundary, fixedBox, grass, roundFour }
