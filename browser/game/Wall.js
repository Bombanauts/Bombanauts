//THREE.JS
import * as THREE from 'three';

//CANNON.JS
import * as CANNON from 'cannon';

import { scene, world } from './main';

export default class Wall {
  constructor(material, texture, fixedCubeShape, fixedCubeGeometry, x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.wallMesh = {};
    this.wallBody = {};
    this.material = material;
    this.texture = texture
    this.fixedCubeShape = fixedCubeShape;
    this.fixedCubeGeometry = fixedCubeGeometry;
    }

    init() {
    // creating wall
    const wallBody = new CANNON.Body({ mass: 0 });
    wallBody.addShape(this.fixedCubeShape)
    const wallMesh = new THREE.Mesh( this.fixedCubeGeometry, this.material );

    // set spawn position
    wallMesh.position.set(this.x, this.y, this.z);
    wallBody.position.set(this.x, this.y, this.z);

    scene.add(wallMesh)
    world.add(wallBody)

    this.wallMesh = wallMesh;
    this.wallBody = wallBody;
  }
}
