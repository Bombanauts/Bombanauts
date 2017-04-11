import * as THREE from 'three';
import * as CANNON from 'cannon';
import { scene, world } from './main';

export default class FixedCube {
  constructor(material, texture, fixedCubeShape, fixedCubeGeometry, x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.fixedCubeMesh = {};
    this.fixedCubeBody = {};
    this.material = material;
    this.texture = texture;
    this.fixedCubeShape = fixedCubeShape;
    this.fixedCubeGeometry = fixedCubeGeometry;
  }

  init() {
    /*----- CREATE FIXED CUBE -----*/
    const fixedCubeBody = new CANNON.Body({ mass: 0 });
    fixedCubeBody.addShape(this.fixedCubeShape);
    const fixedCubeMesh = new THREE.Mesh(this.fixedCubeGeometry, this.material);

    /*----- SETS SPAWN POSITION -----*/
    fixedCubeMesh.position.set(this.x, this.y, this.z);
    fixedCubeBody.position.set(fixedCubeMesh.position.x, fixedCubeMesh.position.y, fixedCubeMesh.position.z);

    scene.add(fixedCubeMesh);
    world.add(fixedCubeBody);

    this.fixedCubeMesh = fixedCubeMesh;
    this.fixedCubeBody = fixedCubeBody;
  }
}
