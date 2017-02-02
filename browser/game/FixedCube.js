
const THREE = require('three')
const CANNON = require('cannon')

import { scene, world } from './main';

export default class FixedCube {
  constructor(material, texture, x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.fixedCubeMesh = {};
    this.fixedCubeBody = {};
    this.material = material;
    this.texture = texture;
    }

    init() {
    const halfExtents = new CANNON.Vec3(2,2,2);
    const fixedCubeShape = new CANNON.Box(halfExtents);
    const fixedCubeGeometry = new THREE.BoxGeometry(halfExtents.x * 1.9, halfExtents.y * 1.9, halfExtents.z * 1.9);

    // creating fixedCube
    const fixedCubeBody = new CANNON.Body({ mass: 0 });
    fixedCubeBody.addShape(fixedCubeShape)
    const fixedCubeMesh = new THREE.Mesh( fixedCubeGeometry, this.material );

    // set spawn position
    fixedCubeMesh.position.set(this.x, this.y, this.z);

    fixedCubeBody.position.set(fixedCubeMesh.position.x, fixedCubeMesh.position.y, fixedCubeMesh.position.z);

    scene.add(fixedCubeMesh)
    world.add(fixedCubeBody)

    this.fixedCubeMesh = fixedCubeMesh;
    this.fixedCubeBody = fixedCubeBody;
  }
}
