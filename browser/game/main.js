const THREE = require('three')
const CANNON = require('cannon')
  // const PointerLockControls = require('./PointerLockControls');
import store from '../store';

import { PointerLockControls } from './PointerLockControls';
import Player from './Player'
import Bomb from './Bomb'

import { Particle, Block } from './Explosion.js';

import Maps from './maps/maps'

import generateMap from './utils/generateMap';

var sphereShape, sphereBody, world, physicsMaterial;
var camera, scene, renderer, light;
var geometry, material, mesh;
var controls, time = Date.now();
var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

export let walls = [];
export let bombs = [];
export let ballMeshes = [];
export let boxes = [];
export let boxMeshes = [];
export let destroyableBoxes = [];
export let destroyableBoxMeshes = [];
export let players = [];
export let playerMeshes = [];
export let yourBombs = [];
export let yourballMeshes = [];

var blocks = new Array();
var blockCount = 25;

export function initCannon() {
  //     // Setup our world
  if (socket) {
    socket.emit('get_players', {});
  }
  world = new CANNON.World();
  world.quatNormalizeSkip = 0;
  world.quatNormalizeFast = false;
  var solver = new CANNON.GSSolver();
  world.defaultContactMaterial.contactEquationStiffness = 1e9;
  world.defaultContactMaterial.contactEquationRelaxation = 4;
  solver.iterations = 7;
  solver.tolerance = 0.1;
  var split = true;
  if (split)
    world.solver = new CANNON.SplitSolver(solver);
  else
    world.solver = solver;
  world.gravity.set(0, -20, 0);
  world.broadphase = new CANNON.NaiveBroadphase();

  //     // Create a slippery material (friction coefficient = 0.0)
  physicsMaterial = new CANNON.Material("slipperyMaterial");
  var physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial,
    physicsMaterial,
    0.0, // friction coefficient
    0.3 // restitution
  );
  //     // We must add the contact materials to the world
  world.addContactMaterial(physicsContactMaterial);

  //     // Create a sphere
  var mass = 5,
    radius = 1.3;
  sphereShape = new CANNON.Sphere(radius);
  sphereBody = new CANNON.Body({ mass: mass });
  sphereBody.addShape(sphereShape);
  sphereBody.position.set(0, 5, 0);
  sphereBody.linearDamping = 0.9;
  world.addBody(sphereBody);

  // Create a plane
  var groundShape = new CANNON.Plane();
  var groundBody = new CANNON.Body({ mass: 0 });
  groundBody.addShape(groundShape);
  groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
  world.addBody(groundBody);
}

// SHOOTING BOMBS HERE

// cannon sphere(radius)
var ballShape = new CANNON.Sphere(1.5);

// three sphere(radius, numFaces per xyz) higher num means rounder sphere
// 32 should be enough for spheres
var ballGeometry = new THREE.SphereGeometry(ballShape.radius, 32, 32);

// generates a vector with no units if you want units you input
// Vector3(x,y,z)
var shootDirection = new THREE.Vector3();

// speed of ball (m/s maybe?)
var shootVelo = 15;

export function init() {
  camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 3, 0)
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 0, 500);
  var ambient = new THREE.AmbientLight(0xffffff);
  scene.add(ambient);
  light = new THREE.SpotLight(0xffffff);
  light.position.set(10, 30, 20);
  light.target.position.set(0, 5, 0);
  // if(true){
  //     light.castShadow = false;
  //     light.shadowCameraNear = 20;
  //     light.shadowCameraFar = 50;//camera.far;
  //     light.shadowCameraFov = 40;
  //     light.shadowMapBias = 0.1;
  //     light.shadowMapDarkness = 0.7;
  //     light.shadowMapWidth = 2*512;
  //     light.shadowMapHeight = 2*512;
  //     light.shadowCameraVisible = true;
  // }
  scene.add(light);

  // this attaches bomb to the player (maybe)
  // look at PointerLockControls function
  // sphereBody.position = (0,5,0) so the sphere should be 5+ in y direction above camera

  controls = new PointerLockControls(camera, sphereBody);
  scene.add(controls.getObject());

  // floor
  geometry = new THREE.PlaneBufferGeometry(125, 125, 50, 50);
  geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
  material = new THREE.MeshLambertMaterial({ color: 0x3f7cba });
  mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);


  // Init Blocks
  for (var i = 0; i < blockCount; i++) {
    var block = new Block(scene, world);
    blocks.push(block);
  }


  renderer = new THREE.WebGLRenderer();
  // renderer.shadowMapEnabled = true;
  // renderer.shadowMapSoft = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(scene.fog.color, 1);
  document.body.appendChild(renderer.domElement);
  window.addEventListener('resize', onWindowResize, false);

  createMap();
  sphereBody.position.x = 0;
  sphereBody.position.y = 10;
  sphereBody.position.z = 0;

  let others = store.getState().players.otherPlayers.players;
  let newPlayer;
  if (socket) {
    socket.emit('update_players_position', {
      position: {
        x: sphereBody.position.x,
        y: sphereBody.position.y,
        z: sphereBody.position.z
      },
      id: socket.id
    });
  }
  for (var player in others) {
    newPlayer = new Player(socket.id, others[player].x, others[player].y, others[player].z)
    newPlayer.init()
    players.push(newPlayer.playerBox)
    playerMeshes.push(newPlayer.playerMesh)

  }

  // add event listen to actually shoot
  if (controls) {
    window.addEventListener("click", function(e) {
      if (controls.enabled == true) {
        // because sphereBody position is dependent on camera position
        let x = sphereBody.position.x;
        let y = sphereBody.position.y;
        let z = sphereBody.position.z;

        const newBomb = new Bomb(Math.random(), { x: x, y: y, z: z });
        newBomb.init()
        //take just the id and position of the ball
        //stack overflow from sending bombBody?
        const bombInfo = { id: newBomb.bombBody.id, position: newBomb.bombBody.position, created: Date.now() }

        // push it into our global bombs array


        socket.emit('add_bomb', {
          userId: socket.id,
          position: { x: x, y: y, z: z }
        })


        yourBombs.push(bombInfo)
        // push ball meshes
        yourballMeshes.push(newBomb.bombMesh);

        // get its direction using getShootDir function
        // returns shootDirection altered with correct data
        getShootDir(shootDirection);

        // console.log(newBomb.bombBody)
        // give it a velocity
        // shootVelo is global defined as 15
        newBomb.bombBody.velocity.set(shootDirection.x * shootVelo,
          shootDirection.y * shootVelo,
          shootDirection.z * shootVelo);

        // Move the ball outside the player sphere
        // not sure about this shit here
        // x,y,z adjusted so it's actually updating the position of the sphere
        x += shootDirection.x * (sphereShape.radius * 1.02 + newBomb.bombShape.radius);
        y += shootDirection.y * (sphereShape.radius * 1.02 + newBomb.bombShape.radius);
        z += shootDirection.z * (sphereShape.radius * 1.02 + newBomb.bombShape.radius);
        newBomb.bombBody.position.set(x, y, z);
        newBomb.bombMesh.position.set(x, y, z);
      }
    });
  }
}

export function createMap() {
  let map0 = Maps[0]
  generateMap(map0);
}

export function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

var dt = 1 / 60; // change in time for walking

// animate the walking and the box positions movements

export function animate() {

  setTimeout(() => {
    if (socket) {
      socket.emit('update_players_position', {
        position: {
          x: sphereBody.position.x,
          y: sphereBody.position.y,
          z: sphereBody.position.z
        },
        id: socket.id
      });
      if (bombs.length) {
        socket.emit('update_bomb_positions', {
          userId: socket.id,
          bombs: yourBombs
        })
      }
    }
    requestAnimationFrame(animate);
  }, 1000 / 60)

  if (controls.enabled) {
    world.step(dt); // function that allows walking from CANNON

    // Update ball positions
    // the bombs in our game

    // UPDATES PLAYERS HERE

    let others = store.getState().players.otherPlayers;
    let playerIds = Object.keys(others)

    let state = store.getState();
    let allBombs = state.bombs.allBombs;
    let stateBombs = [];
    console.log('allBombs', allBombs)

    for (let key in allBombs) {
      stateBombs.push(...allBombs[key])
    }

    if (playerIds.length !== players.length) {
      players = [];
      playerMeshes = [];
      for (let player in others) {
        let newPlayer;
        newPlayer = new Player(socket.id, others[player].x, others[player].y, others[player].z)
        newPlayer.init()
        players.push(newPlayer.playerBox)
        playerMeshes.push(newPlayer.playerMesh)
        newPlayer.playerMesh.castShadow = true;
        newPlayer.playerMesh.receiveShadow = true;
      }
    }

    for (let i = 0; i < players.length; i++) {
      let { x, y, z } = others[playerIds[i]]
      playerMeshes[i].position.set(x, y, z);
      players[i].position.x = x;
      players[i].position.y = y;
      players[i].position.z = z;
    }

    for (var i = 0; i < blockCount; i++) {
      blocks[i].loop();
    }

    // add new bomb if there is one
    //we are only adding to the bombs array and bombMesh array when we receive back from the update bombs socket emitter, not when we first create the bomb
    if (stateBombs.length > bombs.length) {
      const mostRecentBomb = stateBombs[stateBombs.length - 1]
      const newBomb = new Bomb(mostRecentBomb.id, mostRecentBomb.position)
      newBomb.init()

      bombs.push(newBomb.bombBody)
      ballMeshes.push(newBomb.bombMesh)
    }

    for (let i = 0; i < bombs.length; i++) {
      let { x, y, z } = stateBombs[i].position
      ballMeshes[i].position.copy(bombs[i].position)
      bombs[i].position.x = x;
      bombs[i].position.y = y;
      bombs[i].position.z = z;
      // bombs[i].position.copy(stateBombs[i].position)
    }

    for (let i = 0; i < yourBombs.length; i++) {
      yourballMeshes[i].position.copy(yourBombs[i].position)
    }

    // Update box positions
    // for(let i=0; i<destroyableBoxes.length; i++){
    //     destroyableBoxMeshes[i].position.set(destroyableBoxes[i].position);
    // }



  }

  controls.update(Date.now() - time);
  renderer.render(scene, camera);
  time = Date.now();
}




// this is outdated should use raycaster instead since it gives more info anyway
// also projector is moved.
// to adjust to use raycaster we need to adjust yawObject and pitch object

TODO: // HERE
  var projector = new THREE.Projector();

// get shoot direction might need to be adjusted to use ray caster instead
const getShootDir = function(targetVec) {
  var vector = targetVec;
  targetVec.set(0, 0, 1);
  projector.unprojectVector(vector, camera);
  var ray = new THREE.Ray(sphereBody.position, vector.sub(sphereBody.position).normalize());
  targetVec.copy(ray.direction);
}

export { scene, camera, renderer, controls, light, getShootDir, world }
