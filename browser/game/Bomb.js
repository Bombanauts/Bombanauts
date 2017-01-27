import store from '../store'
import socket from '../socket'

const THREE = require('three')
const CANNON = require('cannon')
const PointerLockControls = require('./PointerLockControls')

import { scene, world } from './main'

let bombBody, bombMesh, material;

export default class Bomb {
	constructor(id, position, quaternion) {
    this.id = id;
    this.position = position;
    this.quaternion = quaternion
    this.bombMesh;
	}

	init() {
		// SHOOTING BOMBS HERE

		// cannon sphere(radius)
		let ballShape = new CANNON.Sphere(1.5);
		// three sphere(radius, numFaces per xyz) higher num means rounder sphere
		// 32 should be enough for spheres
		let ballGeometry = new THREE.SphereGeometry(ballShape.radius, 32, 32);
		// generates a vector with no units if you want units you input
		// Vector3(x,y,z)
		let shootDirection = new THREE.Vector3();
		// speed of ball (m/s maybe?)
		let shootVelo = 15;

        // create the ball
       	bombBody = new CANNON.Body({ mass: 1 });
        bombBody.addShape(ballShape);
       	bombMesh = new THREE.Mesh(ballGeometry, material);

        world.addBody(bombBody);

        // add it to the scene
        scene.add(bombMesh);

        // shadow affects
        bombMesh.castShadow = true;
        bombMesh.receiveShadow = true;


	}
}