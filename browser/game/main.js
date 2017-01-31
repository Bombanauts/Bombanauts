const THREE = require('three')
const CANNON = require('cannon')
import store from '../store';

import { PointerLockControls } from './PointerLockControls';
import Player from './Player'
import Bomb, { fire, fire2, fire3, fire4, fire5 } from './Bomb'

import { Particle, Block } from './Explosion.js';
// import { VolumetricFire } from '../bombs/ParticleEngine.js';

import Maps from './maps/maps'

import generateMap from './utils/generateMap';

let sphereShape, sphereBody, world, physicsMaterial;
let camera, scene, renderer, light;
let geometry, material, mesh;
let controls, time = Date.now();
let clock;
const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;

export const walls = [];
export const bombs = [];
export const ballMeshes = [];
export const boxes = [];
export const boxMeshes = [];
export const destroyableBoxes = [];
export const destroyableBoxMeshes = [];
export let players = [];
export let playerMeshes = [];
export let yourBombs = [];
export let yourballMeshes = [];

export const blocksObj = {};
export const blockCount = 25;

export function initCannon() {
  //set up our world, check for other players
  if (socket) {
    socket.emit('get_players', {});
  }
  world = new CANNON.World();
  world.quatNormalizeSkip = 0;
  world.quatNormalizeFast = false;
  const solver = new CANNON.GSSolver();
  world.defaultContactMaterial.contactEquationStiffness = 1e9;
  world.defaultContactMaterial.contactEquationRelaxation = 4;
  solver.iterations = 7;
  solver.tolerance = 0.1;
  const split = true;
  if (split)
    world.solver = new CANNON.SplitSolver(solver);
  else
    world.solver = solver;
  world.solver.iterations = 20; // Increase solver iterations (default is 10)
  world.solver.tolerance = 0;   // Force solver to use all iterations

  world.gravity.set(0,-40,0);
  world.broadphase = new CANNON.NaiveBroadphase();

  //     // Create a slippery material (friction coefficient = 0.0)
  physicsMaterial = new CANNON.Material("slipperyMaterial");
  const physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial,
    physicsMaterial,
    0.0,
    0.9// restitution
  );

  physicsMaterial.contactEquationStiffness = 1e8;
  physicsMaterial.contactEquationRegularizationTime = 3;
  //     // We must add the contact materials to the world
  world.addContactMaterial(physicsContactMaterial);

  //     // Create a sphere
  const mass = 5,
    radius = 1.3;
  sphereShape = new CANNON.Sphere(radius);
  sphereBody = new CANNON.Body({ mass: mass });
  sphereBody.addShape(sphereShape);
  sphereBody.position.set(0, 5, 0);
  sphereBody.linearDamping = 0.9;
  world.addBody(sphereBody);

  // Create a plane
  const groundShape = new CANNON.Plane();
  const groundBody = new CANNON.Body({ mass: 0 });
  groundBody.addShape(groundShape);
  groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
  world.addBody(groundBody);
}

// cannon sphere(radius)
const ballShape = new CANNON.Sphere(1.5);
const ballGeometry = new THREE.SphereGeometry(ballShape.radius, 32, 32);
const shootDirection = new THREE.Vector3();
const shootVelo = 8;

const projector = new THREE.Projector();

// get shoot direction might need to be adjusted to use ray caster instead
const getShootDir = function(targetVec) {
  var vector = targetVec;
  targetVec.set(0, 0, 1);
  projector.unprojectVector(vector, camera);
  var ray = new THREE.Ray(sphereBody.position, vector.sub(sphereBody.position).normalize());
  targetVec.copy(ray.direction);
}

export function init() {
  camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1500);
  camera.position.set(0, 3, 0)
  scene = new THREE.Scene();
  // scene.fog = new THREE.Fog(0x000000, 0, 500);
  const ambient = new THREE.AmbientLight(0xffffff);
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

  //Create Fire
  clock = new THREE.Clock()

  controls = new PointerLockControls(camera, sphereBody);
  scene.add(controls.getObject());

  // floor
  geometry = new THREE.PlaneBufferGeometry(125, 125, 50, 50);
  geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
  const texture = new THREE.TextureLoader().load('images/grass.jpeg');
  material = new THREE.MeshLambertMaterial({ map: texture });
  //repeat texture tiling for the floor
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.x = 20;
  texture.repeat.y = 20;
  mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);

  const skyGeo = new THREE.SphereGeometry(1000, 32, 32);
  const skyTexture = new THREE.TextureLoader().load('images/sky.jpg');
  const skyMaterial = new THREE.MeshBasicMaterial({ map: skyTexture });
  const sky = new THREE.Mesh(skyGeo, skyMaterial);
  sky.material.side = THREE.BackSide;
  scene.add(sky);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
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

  for (let player in others) {
    newPlayer = new Player(socket.id, others[player].x, others[player].y, others[player].z)
    newPlayer.init()
    players.push(newPlayer.playerBox)
    playerMeshes.push(newPlayer.playerMesh)
  }

  if (controls) {
    window.addEventListener("click", function(e) {
      if (controls.enabled == true) {
        // get current self position to shoot
        let x = sphereBody.position.x;
        let y = sphereBody.position.y;
        let z = sphereBody.position.z;

        const newBomb = new Bomb(Math.random(), { x: x, y: y, z: z });
        newBomb.init()

        //take relevant bomb info and emit
        const bombInfo = { id: newBomb.bombBody.id, position: newBomb.bombBody.position, created: Date.now() }

        socket.emit('add_bomb', {
          userId: socket.id,
          position: { x: x, y: y, z: z }
        })

        //add bomb and mesh to your bombs arrays
        yourBombs.push(bombInfo)
        yourballMeshes.push(newBomb.bombMesh);

        // get its direction using getShootDir function
        getShootDir(shootDirection);

        // give it a shoot velocity
        newBomb.bombBody.velocity.set(shootDirection.x * shootVelo,
          shootDirection.y * shootVelo,
          shootDirection.z * shootVelo);

        // Move the ball outside the player sphere
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

//animation GAME LOOP
export function animate() {

  setTimeout(() => {
      if (socket) {
        socket.emit('update_world', {
          playerId: socket.id,
          playerPosition: {
            x: sphereBody.position.x,
            y: sphereBody.position.y,
            z: sphereBody.position.z
          },
          playerBombs: yourBombs
        });
      }
      requestAnimationFrame(animate);
    }, 1000 / 60) //throttled to 60 times per second

  if (controls.enabled) {
    world.step(dt); // function that allows walking from CANNON

    const others = store.getState().players.otherPlayers;
    const playerIds = Object.keys(others)

    const state = store.getState();
    const allBombs = state.bombs.allBombs;
    const stateBombs = [];

    for (let key in allBombs) {
      stateBombs.push(...allBombs[key])
    }

    //Animate Fire w/ Bombs
    let elapsed = clock.getElapsedTime()
    if(fire) fire.update(elapsed)
    if(fire2) fire2.update(elapsed)
    if(fire3) fire3.update(elapsed)
    if(fire4) fire4.update(elapsed)
    if(fire5) fire5.update(elapsed)
    


    //make a new player object if there is one
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

    //updating player positions
    for (let i = 0; i < players.length; i++) {
      let { x, y, z } = others[playerIds[i]]
      playerMeshes[i].position.set(x, y, z);
      players[i].position.x = x;
      players[i].position.y = y;
      players[i].position.z = z;
    }


    for (let block in blocksObj) {
      if (blocksObj[block].length) {
  			for (var i = 0; i < blocksObj[block].length; i++) {
  					blocksObj[block][i].loop(block);
  			}
      } else {
        delete blocksObj[block]
      }
    }

    // add new bomb if there is one
    if (stateBombs.length > bombs.length) {
      const mostRecentBomb = stateBombs[stateBombs.length - 1]
      const newBomb = new Bomb(mostRecentBomb.id, mostRecentBomb.position)
      newBomb.init()

      bombs.push(newBomb.bombBody)
      ballMeshes.push(newBomb.bombMesh)
    }

    //update bomb position
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

export { scene, camera, renderer, controls, light, getShootDir, world }
