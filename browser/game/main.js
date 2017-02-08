const THREE = require('three')
const CANNON = require('cannon')
import store from '../store';
import socket, { playerArr } from '../socket';

import { PointerLockControls } from './PointerLockControls';
import Player from './Player'
import Bomb from './Bomb'
import { killPlayer } from '../dead/action-creator'
import { Particle, Block } from './Explosion.js';

import { generateMap, roundFour, animateFire, animatePlayers, animateExplosion, animateBombs, deleteWorld, createMap, getShootDir } from './utils';

let sphereShape, world, physicsMaterial;
let camera, scene, renderer, light;
let geometry, material, mesh;
let controls, time = Date.now();
let clock;
const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;

export let listener;
export let sphereBody;
export const walls = [];
export let bombs = [];
export let bombMeshes = [];
export let boxes = [];
export let boxMeshes = [];
export let players = [];
export let playerMeshes = [];
export let yourBombs = [];
export let yourBombMeshes = [];
export let playerInstances = [];
export const blocksObj = {};
export const blockCount = 50;

let bombObjects = [];
let count = 1;
let prevPlayerStateLength = 0;
let dead = false;
let nickname = '';
let allowBomb = true;
const dt = 1 / 60;
let prevStateLength = 0;
let counter = 0;
const spawnPositions = [
  { x: 11.5, y: 1.5, z: -4 },
  { x: 12.1, y: 1.5, z: 36.4 },
  { x: -36, y: 1.5, z: 36 },
  { x: -36.4, y: 1.5, z: -4 },
]
const bombMaterial = new THREE.MeshLambertMaterial({ color: '#000000' })


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
  world.solver.tolerance = 0; // Force solver to use all iterations

  world.gravity.set(0, -40, 0);
  world.broadphase = new CANNON.NaiveBroadphase();


  physicsMaterial = new CANNON.Material('groundMaterial');
  // Adjust constraint equation parameters for ground/ground contact
  const physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial, physicsMaterial, {
    friction: 0.7,
    restitution: 0.3,
    contactEquationStiffness: 1e8,
    contactEquationRelaxation: 3,
    frictionEquationStiffness: 1e8,
    frictionEquationRegularizationTime: 3,
  });

  //add the contact materials to the world
  world.addContactMaterial(physicsContactMaterial);

  // Create a sphere
  const mass = 100,
    radius = 1.3;
  sphereShape = new CANNON.Sphere(radius);
  sphereBody = new CANNON.Body({ mass: mass, material: physicsMaterial });
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


export function init() {
  camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1500);
  camera.position.set(0, 3, 0)
  scene = new THREE.Scene();
  const ambient = new THREE.AmbientLight(0xffffff);
  scene.add(ambient);
  light = new THREE.SpotLight(0xffffff);
  light.position.set(10, 30, 20);
  light.target.position.set(0, 5, 0);
  scene.add(light);

  //create clock for fire animation
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
  scene.add(mesh);

  //skybox
  const skyGeo = new THREE.SphereGeometry(1000, 32, 32);
  const skyMaterial = new THREE.MeshBasicMaterial({ color: '#7EC0EE' });
  const sky = new THREE.Mesh(skyGeo, skyMaterial);
  sky.material.side = THREE.BackSide;
  scene.add(sky);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  window.addEventListener('resize', onWindowResize, false);

  createMap();

  sphereBody.position.x = 100;
  sphereBody.position.y = 100;
  sphereBody.position.z = 100;
  listener = new THREE.AudioListener();
  camera.add(listener);

  let others = store.getState().players;
  let newPlayer;

  for (let player in others) {
    newPlayer = new Player(player, others[player].x, others[player].y, others[player].z, others[player].dead)
    newPlayer.init()
    players.push(newPlayer.playerBox)
    playerMeshes.push(newPlayer.playerMesh)
    playerInstances.push(newPlayer)
  }
  prevPlayerStateLength = players.length;

  if (controls) {
    window.addEventListener("click", function(e) {
      if (controls.enabled == true && !dead && allowBomb) {
        // get current self position to shoot
        let x = sphereBody.position.x;
        let y = sphereBody.position.y;
        let z = sphereBody.position.z;

        const newBomb = new Bomb(count++, { x: x, y: y, z: z }, bombMaterial);
        newBomb.init()
        allowBomb = false;
        setTimeout(() => {
          allowBomb = true;
        }, 3000)

        //take relevant bomb info and emit
        const bombInfo = { id: newBomb.id, position: newBomb.bombBody.position, created: Date.now() }

        socket.emit('add_bomb', {
          userId: socket.id,
          bombId: bombInfo.id,
          position: { x: x, y: y, z: z }
        })

        //remove from your front end bombs array, this will update game state on update_world on next frame
        setTimeout(() => {
          yourBombs = yourBombs.filter((bomb) => {
            return bomb.id !== bombInfo.id
          })
          yourBombMeshes = yourBombMeshes.filter(mesh => {
            return newBomb.bombMesh.id !== mesh.id
          })
        }, 2000)

        //add bomb and mesh to your bombs arrays
        yourBombs.push(bombInfo)
        bombObjects.push(newBomb)
        yourBombMeshes.push(newBomb.bombMesh);

        // get its direction using getShootDir function
        getShootDir(projector, camera, shootDirection);

        // give it a shoot velocity
        newBomb.bombBody.velocity.set(shootDirection.x * shootVelo,
          shootDirection.y * shootVelo,
          shootDirection.z * shootVelo);

        // shoot your bomb
        x += shootDirection.x * (sphereShape.radius * 1.02 + newBomb.bombShape.radius);
        y += shootDirection.y * (sphereShape.radius * 1.02 + newBomb.bombShape.radius);
        z += shootDirection.z * (sphereShape.radius * 1.02 + newBomb.bombShape.radius);
        newBomb.bombBody.position.set(x, y, z);
        newBomb.bombMesh.position.set(x, y, z);
      }
    });
  }
}

export function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

//animation GAME LOOP
export function animate() {
  counter++;
  setTimeout(() => {
      if (socket) {
        socket.emit('update_world', {
          playerId: socket.id,
          playerPosition: {
            x: sphereBody.position.x,
            y: sphereBody.position.y,
            z: sphereBody.position.z
          },
          dead: dead,
          playerBombs: yourBombs
        });
      }
      requestAnimationFrame(animate);
    }, 1000 / 60) //throttled to 60 times per second


  //set player spawn after getting initial state from sockets
  if (counter === 50) {
    sphereBody.position.x = spawnPositions[playerArr.indexOf(socket.id)].x;
    sphereBody.position.y = 5
    sphereBody.position.z = spawnPositions[playerArr.indexOf(socket.id)].z;
  }

  world.step(dt); // function that allows walking from CANNON

  //gathering your current state
  const state = store.getState();
  const others = state.players;
  const playerIds = Object.keys(others)
  const allBombs = state.bombs;
  const stateBombs = [];
  for (let key in allBombs) {
    stateBombs.push(...allBombs[key])
  }

  if (playerIds.length !== players.length) {
    players.forEach(body => {
      world.remove(body)
    })

    playerMeshes.forEach(playermesh => {
      scene.remove(playermesh)
    })
    players = [];
    playerMeshes = [];
    playerInstances = [];
    for (let player in others) {
      // CHECKING IF PLAYER HAS NICKNAME BEFORE CREATING NEW PLAYER
      if (others[player].nickname) {
        let newPlayer;
        newPlayer = new Player(player, others[player].x, others[player].y, others[player].z, false)
        newPlayer.init()
  
        players.push(newPlayer.playerBox)
        playerMeshes.push(newPlayer.playerMesh)
        playerInstances.push(newPlayer)
      }
    }
  }

  // add new bomb if there is one
  if (stateBombs.length > prevStateLength) {
    const mostRecentBomb = stateBombs[stateBombs.length - 1]
    const newBomb = new Bomb(mostRecentBomb.id, mostRecentBomb.position, bombMaterial)
    newBomb.init()

    bombs.push(newBomb.bombBody)
    bombObjects.push(newBomb)
    bombMeshes.push(newBomb.bombMesh)
  }
  //reset previous state length
  prevStateLength = stateBombs.length

  //animate fire with bombs

  dead = animateFire(bombObjects, clock, dead)
    //updating player positions
  animatePlayers(players, playerIds, others, playerMeshes)
    //animating explosion particles
  animateExplosion(blocksObj)
    //animating bomb positions
  animateBombs(yourBombs, yourBombMeshes, bombs, stateBombs, bombMeshes, prevStateLength)

  controls.update(Date.now() - time);
  renderer.render(scene, camera);
  time = Date.now();
}


//clear out and rebuild entire map to restart, respawn player
export function restartWorld() {
  deleteWorld(scene, world, boxMeshes, boxes, bombs, bombMeshes, yourBombs, bombObjects, yourBombMeshes, players, playerMeshes);

  boxMeshes = [];
  boxes = [];
  bombs = [];
  bombMeshes = [];
  yourBombs = [];
  bombObjects = [];
  yourBombMeshes = [];
  players = [];
  playerMeshes = [];
  playerInstances = [];

  createMap();

  sphereBody.position.x = spawnPositions[playerArr.indexOf(socket.id)].x;
  sphereBody.position.y = 5
  sphereBody.position.z = spawnPositions[playerArr.indexOf(socket.id)].z;
  dead = false;
}

export { scene, camera, renderer, controls, light, world, dead }
