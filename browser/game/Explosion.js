import store from '../store'
import socket from '../socket'

const THREE = require('three')
const CANNON = require('cannon')
const PointerLockControls = require('./PointerLockControls')

import { scene, world, blocksObj } from './main'

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

export const Block = function (scene, world, position) {

  const MAX_SIZE = 0.5;
  const MIN_SIZE = 0.08;

  //cerate randomly sized cube
  const boxShape = new CANNON.Box(new CANNON.Vec3(0.4,0.4,0.4))
  const texture = new THREE.TextureLoader().load('images/crate.gif');
  const boxGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4)
  const boxBody = new CANNON.Body()

  // Vector3(x,y,z)
  const shootDirection = new THREE.Vector3();

  // speed of ball (m/s maybe?)
  const shootVelo = 15;

  // var ballBody = new CANNON.Body({ mass: 1 });
  boxBody.addShape(boxShape);
  const material = new THREE.MeshLambertMaterial({ map: texture });
  this.particle = new THREE.Mesh(boxGeometry, material);

  // shadow affects
  this.particle.castShadow = true;
  this.particle.receiveShadow = true;

  // starting position
  this.particle.position.x = position.x;
  this.particle.position.y = position.y;
  this.particle.position.z = position.z;

  this.reset(this.particle.position.x, this.particle.position.y, this.particle.position.z);
  world.addBody(boxBody)
  scene.add(this.particle);
}

Block.prototype.reset = function(x, y, z){

  const MAX_SPEED = 0.15;
  const MAX_ROT = .1;

  this.xd = Math.random() * MAX_SPEED * 2 - MAX_SPEED ;
  this.yd = Math.abs(Math.random() * MAX_SPEED * 2 - MAX_SPEED) ;
  this.zd = Math.random() * MAX_SPEED * 2 - MAX_SPEED ;

  this.particle.position.x = x;
  this.particle.position.y = y;
  this.particle.position.z = z;

  this.xrd = Math.random()*MAX_ROT*2 - MAX_ROT;
  this.zrd = Math.random()*MAX_ROT*2 - MAX_ROT;

  this.particle.rotation.x = Math.random()*360;
  this.particle.rotation.z = Math.random()*360;

  this.ticks = 0;

}

Block.prototype.loop = function(key){

  this.particle.position.x += this.xd;
  this.particle.position.y += this.yd;
  this.particle.position.z += this.zd;

  this.particle.rotation.x += this.xrd;
  this.particle.rotation.z += this.zrd;
  this.ticks ++;
  if (this.ticks > 100) {
    scene.remove(this.particle)
    if (this.ticks > 301) {
      blocksObj[key] = [];
    }
    return;
  }

}
