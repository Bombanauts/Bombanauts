import store from '../store'
import socket from '../socket'

const THREE = require('three')
const CANNON = require('cannon')
const PointerLockControls = require('./PointerLockControls')

import { scene, world, animate, camera } from './main'
import { VolumetricFire } from '../bombs/ParticleEngine';

let bombBody, bombMesh;
let fire;

export default class Bomb {
  constructor(id, position) {
    this.id = id;
    this.position = position;
    this.bombMesh;
    this.bombBody;
    this.bombShape;
    this.material;

    this.init = this.init.bind(this);
    this.explode = this.explode.bind(this);
  }

  explode(bombMesh, bombBody) {
    // removes from three js and cannon js
    scene.remove(bombMesh)
    world.remove(bombBody)

    // create Fiyahhhh
      let fireWidth = 4
      let fireHeight = 16
      let fireDepth = 4
      let sliceSpacing = 0.5

      fire = new VolumetricFire(fireWidth, fireHeight, fireDepth, sliceSpacing, camera)

      fire.mesh.position.set(bombBody.position.x, bombBody.position.y, bombBody.position.z)

      VolumetricFire.texturePath = '../../public/assets/images';

      fire.mesh.frustumCulled = false;

      scene.add(fire.mesh)

      setTimeout(() => {
        scene.remove(fire.mesh)
        fire = null;
      }, 1000)


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
    this.bombBody = new CANNON.Body({ mass: 10 });
    this.bombBody.addShape(this.bombShape);
    this.bombMesh = new THREE.Mesh(bombGeometry, this.material);
    world.addBody(this.bombBody);
    // add it to the scene
    scene.add(this.bombMesh);
    // shadow affects
    this.bombMesh.castShadow = true;
    this.bombMesh.receiveShadow = true;

    setTimeout(() => {
        console.log('INSIDE SET TIMEOUT')
        this.explode(this.bombMesh, this.bombBody)
    }, 2000)
  }
}

export { fire };
