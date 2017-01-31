import store from '../store'
import socket from '../socket'

const THREE = require('three')
const CANNON = require('cannon')
const PointerLockControls = require('./PointerLockControls')

import { scene, world, animate, camera } from './main'
import { VolumetricFire } from '../bombs/ParticleEngine';
import { boundary, fixedBox, grass, roundFour } from './utils/generateMap'

let bombBody, bombMesh;
let fire, fire2, fire3, fire4, fire5;

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
        this.explode()
    }, 2000)
  }

  explode() {
    // removes from three js and cannon js
    scene.remove(this.bombMesh)
    world.remove(this.bombBody)

    let x =  roundFour(this.bombBody.position.x)
    let y = this.bombBody.position.y + 4
    let z = roundFour(this.bombBody.position.z)

    // create Fire
    let fireWidth = 4
    let fireHeight = 12
    let fireDepth = 4
    let sliceSpacing = 0.5

    if (grass[`${x}_${z}`]) {
        fire = new VolumetricFire(fireWidth, fireHeight, fireDepth, sliceSpacing, camera)
        fire.mesh.frustumCulled = false;
        fire.mesh.position.set(x, y, z)
        scene.add(fire.mesh)
    }

    if (grass[`${x + 4}_${z}`]) {
        fire2 = new VolumetricFire(fireWidth, fireHeight, fireDepth, sliceSpacing, camera)
        fire2.mesh.frustumCulled = false;
        fire2.mesh.position.set(x + 4, y, z)
        scene.add(fire2.mesh)
    }

    if (grass[`${x-4}_${z}`]) {
        fire3 = new VolumetricFire(fireWidth, fireHeight, fireDepth, sliceSpacing, camera)
        fire3.mesh.frustumCulled = false;
        fire3.mesh.position.set(x - 4, y, z)
        scene.add(fire3.mesh)
    }

    if (grass[`${x}_${z + 4}`]) {
        fire4 = new VolumetricFire(fireWidth, fireHeight, fireDepth, sliceSpacing, camera)
        fire4.mesh.frustumCulled = false;
        fire4.mesh.position.set(x, y, z + 4)
        scene.add(fire4.mesh)
    }

    if (grass[`${x}_${z - 4}`]) {
        fire5 = new VolumetricFire(fireWidth, fireHeight, fireDepth, sliceSpacing, camera)
        fire5.mesh.frustumCulled = false;
        fire5.mesh.position.set(x, y, z - 4)
        scene.add(fire5.mesh)
    }

    VolumetricFire.texturePath = '../../public/assets/images';

    setTimeout(() => {
        scene.remove(fire.mesh)
        scene.remove(fire2.mesh)
        scene.remove(fire3.mesh)
        scene.remove(fire4.mesh)
        scene.remove(fire5.mesh)
        fire = null;
        fire2 = null;
        fire3 = null;
        fire4 = null;
        fire5 = null;
    }, 1000)
  }
}

export { fire, fire2, fire3, fire4, fire5 };
