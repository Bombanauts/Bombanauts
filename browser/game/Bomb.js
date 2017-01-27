import store from '../store'
import socket from '../socket'

const THREE = require('three')
const CANNON = require('cannon')
const PointerLockControls = require('./PointerLockControls')

import { scene, world } from './main'

let bombBody, bombMesh, material;

export default class Bomb {
  constructor(id, position) {
    this.id = id;
    this.position = position;
    this.bombMesh;
    this.bombBody;
    this.init = this.init.bind(this);
    this.init();
  }
  init() {

    let bombShape = new CANNON.Sphere(1.5);
    // three sphere(radius, numFaces per xyz) higher num means rounder sphere
    // 32 should be enough for spheres
    let bombGeometry = new THREE.SphereGeometry(bombShape.radius, 32, 32);
    // generates a vector with no units if you want units you input
    // Vector3(x,y,z)
    material = new THREE.MeshLambertMaterial({ color: 0x3f7cba });

    // create the ball
    this.bombBody = new CANNON.Body({ mass: 1 });
    this.bombBody.addShape(bombShape);
    this.bombMesh = new THREE.Mesh(bombGeometry, material);
    world.addBody(this.bombBody);
    // add it to the scene
    scene.add(this.bombMesh);
    // shadow affects
    this.bombMesh.castShadow = true;
    this.bombMesh.receiveShadow = true;
  }
}
