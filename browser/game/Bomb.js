import store from '../store'
import socket from '../socket'

const THREE = require('three')
const CANNON = require('cannon')
const PointerLockControls = require('./PointerLockControls')

import { scene, world } from './main'

let bombBody, bombMesh;

export default class Bomb {
  constructor(id, position) {
    this.id = id;
    this.position = position;

    // Why declare all these here? To keep track of the propertiess this class has?
    this.bombMesh;
    this.bombBody;
    this.bombShape;
    this.material;
    this.init = this.init.bind(this);
  }

  init() {
    // console.log('POSITION: ', this.position)
    this.bombShape = new CANNON.Sphere(1.5);
    // three sphere(radius, numFaces per xyz) higher num means rounder sphere
    // 32 should be enough for spheres
    let bombGeometry = new THREE.SphereGeometry(this.bombShape.radius, 32, 32);
    // generates a vector with no units if you want units you input
    // Vector3(x,y,z)
    this.material = new THREE.MeshLambertMaterial({ color: 0x3f7cba });

    // create the ball
    this.bombBody = new CANNON.Body({ mass: 1 });
    this.bombBody.addShape(this.bombShape);
    this.bombMesh = new THREE.Mesh(bombGeometry, this.material);
    world.addBody(this.bombBody);
    // add it to the scene
    scene.add(this.bombMesh);
    // shadow affects
    this.bombMesh.castShadow = true;
    this.bombMesh.receiveShadow = true;
  }
}
