import store from '../store'
import socket from '../socket'

const THREE = require('three')
const CANNON = require('cannon')
const PointerLockControls = require('./PointerLockControls')

import { scene, world } from './main'

export const Particle = function (width, height, depth) {

  THREE.Geometry.call(this);

  var scope = this,
  width_half = width / 2,
  height_half = height / 2,
  depth_half = depth / 2;

  vertices(  width_half,  height_half, -depth_half );
  vertices(  width_half, -height_half, -depth_half );
  vertices( -width_half, -height_half, -depth_half );
  vertices( -width_half,  height_half, -depth_half );
  vertices(  width_half,  height_half,  depth_half );
  vertices(  width_half, -height_half,  depth_half );
  vertices( -width_half, -height_half,  depth_half );
  vertices( -width_half,  height_half,  depth_half );

  f4( 0, 1, 2);
  f4( 4, 7, 6);
  f4( 0, 4, 5);
  f4( 1, 5, 6 );
  f4( 2, 6, 7 );
  f4( 4, 0, 3 );

  function vertices(x, y, z) {

    scope.vertices.push( new THREE.Vector3( x, y, z )  );
  }

  function f4(a, b, c) {

    scope.faces.push( new THREE.Face3( a, b, c) );
  }
}

Particle.prototype = new THREE.Geometry();
Particle.prototype.constructor = Particle;

export const Block = function (scene, world) {

  var MAX_SIZE = 0.5;
  var MIN_SIZE = 0.08;

  //cerate randomly sized cube
  var boxShape = new CANNON.Box(new CANNON.Vec3(0.4,0.4,0.4))
  var boxGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4)
  var boxBody = new CANNON.Body()

  // Vector3(x,y,z)
  var shootDirection = new THREE.Vector3();

  // speed of ball (m/s maybe?)
  var shootVelo = 15;

  // var ballBody = new CANNON.Body({ mass: 1 });
  boxBody.addShape(boxShape);
  let color = new THREE.MeshLambertMaterial({color: 0x8B4513})
  this.particle = new THREE.Mesh(boxGeometry, color);

  // shadow affects
  this.particle.castShadow = true;
  this.particle.receiveShadow = true;

  this.reset();
  world.addBody(boxBody)
  scene.add(this.particle);
}



Block.prototype.reset = function(){

  var MAX_SPEED = 0.1;
  var MAX_ROT = .1;

  this.xd = Math.random()*MAX_SPEED*2 - MAX_SPEED ;
  this.yd = Math.abs(Math.random()*MAX_SPEED*2 - MAX_SPEED) ;
  this.zd = Math.random()*MAX_SPEED*2 - MAX_SPEED ;

  this.xrd = Math.random()*MAX_ROT*2 - MAX_ROT;
  this.zrd = Math.random()*MAX_ROT*2 - MAX_ROT;

  this.particle.position.x = 0;
  this.particle.position.y = 5;
  this.particle.position.z = 3;

  this.particle.rotation.x = Math.random()*360;
  this.particle.rotation.z = Math.random()*360;

  this.ticks = 0;

}

Block.prototype.loop = function(){


    this.particle.position.x += this.xd;
  this.particle.position.y += this.yd;
  this.particle.position.z += this.zd;

  this.particle.rotation.x += this.xrd;
  this.particle.rotation.z += this.zrd;
  this.ticks ++;

  if (this.ticks > 100){
    this.reset();
  }

}
