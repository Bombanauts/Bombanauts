
const THREE = require('three')

import { scene, blocksObj } from './main'

export const Particle = function (width, height, depth) {
  THREE.Geometry.call(this);

  const scope = this,
    widthHalf = width / 2,
    heightHalf = height / 2,
    depthHalf = depth / 2;  // If you're doing a multiline(?? w/e this is called) variable dex, consider indenting subsecquent dex.


  // What is going on here and is there a way to DRY this out?
  vertices(  widthHalf,  heightHalf, -depthHalf );
  vertices(  widthHalf, -heightHalf, -depthHalf );
  vertices( -widthHalf, -heightHalf, -depthHalf );
  vertices( -widthHalf,  heightHalf, -depthHalf );
  vertices(  widthHalf,  heightHalf,  depthHalf );
  vertices(  widthHalf, -heightHalf,  depthHalf );
  vertices( -widthHalf, -heightHalf,  depthHalf );
  vertices( -widthHalf,  heightHalf,  depthHalf );

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

export const Block = function (scene, world, position, type, geometry, material) {
  const MAX_SIZE = 0.5;  // What and why are these hard-coded values?
  const MIN_SIZE = 0.08;

  //create cube or bomb particles
  if (type === 'cube') {
    this.particle = new THREE.Mesh(geometry, material);
  }
  if (type === 'bomb') {
    this.particle = new THREE.Mesh(geometry, material);
    position.y -= 6;
  }
  if (type === 'player') {
    this.particle = new THREE.Mesh(geometry, material);
    position.y -= 6;
  }

  // starting position
  this.particle.position.x = position.x;
  this.particle.position.y = position.y;
  this.particle.position.z = position.z;

  this.reset(this.particle.position.x, this.particle.position.y, this.particle.position.z);

  //add to scene
  scene.add(this.particle);
}

Block.prototype.reset = function(x, y, z){
  const MAX_SPEED = 0.75;  // Same question
  const MAX_ROT = 0.1;

  // Consider DRYing this out with a 'utils' function?
  this.xd = Math.random() * MAX_SPEED * 2 - MAX_SPEED ;
  this.yd = Math.abs(Math.random() * MAX_SPEED * 2 - MAX_SPEED) ;
  this.zd = Math.random() * MAX_SPEED * 2 - MAX_SPEED ;

  this.particle.position.x = x;
  this.particle.position.y = y;
  this.particle.position.z = z;

  this.xrd = Math.random() * MAX_ROT * 2 - MAX_ROT;
  this.zrd = Math.random() * MAX_ROT * 2 - MAX_ROT;

  this.particle.rotation.x = Math.random() * 360;
  this.particle.rotation.z = Math.random() * 360;

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
  }
}
