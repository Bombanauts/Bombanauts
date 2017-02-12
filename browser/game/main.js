import * as THREE from 'three'
import * as CANNON from 'cannon'

import store from '../redux/store'

import socket, { playerArr } from '../socket'

import { PointerLockControls } from './PointerLockControls'

import Player from './Player'
import Bomb from './Bomb'
import {
  animateFire,
  animatePlayers,
  animateExplosion,
  animateBombs,
  deleteWorld,
  createMap,
  getShootDir
} from './utils'

let sphereShape, world, physicsMaterial;
let camera, scene, renderer, light;
let geometry, material, mesh;
let controls, time = Date.now();
let clock;


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
  { x: -36, y: 1.5, z: 36 },
  { x: 12.1, y: 1.5, z: 36.4 },
  { x: -36.4, y: 1.5, z: -4 },
]
const bombMaterial = new THREE.MeshPhongMaterial({
  color: 0x000000,
  specular: 0x050505,
  shininess: 100
})


export function initCannon() {
  /*----- SETS UP WORLD & CHECKS FOR OTHER PLAYERS -----*/
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

  /*----- INCREASE SOLVER ITERATIONS (DEF: 10) -----*/
  world.solver.iterations = 20;

  /*----- FORCE SOLVER TO USE ALL ITERATIONS -----*/
  world.solver.tolerance = 0;

  world.gravity.set(0, -40, 0);
  world.broadphase = new CANNON.NaiveBroadphase();


  physicsMaterial = new CANNON.Material('groundMaterial');

  /*----- ADJUSTS CONSTRAINT EQUATION PARAMS FOR GROUND/GROUND CONTACT -----*/
  const physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial, physicsMaterial, {
    friction: 0.7,
    restitution: 0.3,
    contactEquationStiffness: 1e8,
    contactEquationRelaxation: 3,
    frictionEquationStiffness: 1e8,
    frictionEquationRegularizationTime: 3,
  });

  /*----- ADD CONTACT MATERIALS TO WORLD -----*/
  world.addContactMaterial(physicsContactMaterial);

  /*----- CREATE A SPHERE -----*/
  const mass = 100,
    radius = 1.3;
  sphereShape = new CANNON.Sphere(radius);
  sphereBody = new CANNON.Body({ mass: mass, material: physicsMaterial });
  sphereBody.addShape(sphereShape);
  sphereBody.position.set(0, 5, 0);
  sphereBody.linearDamping = 0.9;
  world.addBody(sphereBody);

  /*----- CREATE A PLANE -----*/
  const groundShape = new CANNON.Plane();
  const groundBody = new CANNON.Body({ mass: 0 });
  groundBody.addShape(groundShape);
  groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
  world.addBody(groundBody);
}

/*----- CANNON SPHERE RADIUS -----*/
const ballShape = new CANNON.Sphere(1.5);
const ballGeometry = new THREE.SphereGeometry(ballShape.radius, 32, 32);
const shootDirection = new THREE.Vector3();
const shootVelo = 8;

const projector = new THREE.Projector();

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

  /*----- CREATE CLOCK FOR FIRE ANIMATION -----*/
  clock = new THREE.Clock()

  controls = new PointerLockControls(camera, sphereBody);
  scene.add(controls.getObject());

  /*----- FLOOR -----*/
  geometry = new THREE.PlaneBufferGeometry(125, 125, 50, 50);
  geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
  const texture = new THREE.TextureLoader().load('images/grass.png');
  material = new THREE.MeshLambertMaterial({ map: texture });
  
  /*----- REPEAT TEXTURE TILING FOR FLOOR -----*/
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.x = 20;
  texture.repeat.y = 20;
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  /*----- SKYBOX -----*/
  const skyGeo = new THREE.SphereGeometry(1000, 32, 32);
  const skyMaterial = new THREE.MeshBasicMaterial({ color: '#00bfff' });
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
    if (others[player].nickname) {
      newPlayer = new Player(player, others[player].x, others[player].y, others[player].z, others[player].dead, others[player].nickname)
      newPlayer.init()
      players.push(newPlayer.playerBox)
      playerMeshes.push(newPlayer.playerMesh)
      playerInstances.push(newPlayer)
    }
  }
  prevPlayerStateLength = players.length;

  function shootBomb(velocity) {
    if (controls.enabled == true && !dead && allowBomb) {
      /*----- GET CURRENT POSITION TO SHOOT -----*/
      let x = sphereBody.position.x;
      let y = sphereBody.position.y;
      let z = sphereBody.position.z;

      const newBomb = new Bomb(count++, { x: x, y: y, z: z }, bombMaterial, socket.id);
      newBomb.init()
      allowBomb = false;
      setTimeout(() => {
        allowBomb = true;
      }, 3000)

      /*----- EMIT RELEVANT BOMB INFO -----*/
      const bombInfo = { id: newBomb.id, position: newBomb.bombBody.position, created: Date.now() }

      socket.emit('add_bomb', {
        userId: socket.id,
        bombId: bombInfo.id,
        position: { x: x, y: y, z: z }
      })

      /*----- REMOVE FROM YOUR FRONTEND BOMBS ARR -----*/
      /*----- WILL UPDATE GAMESTATE ON NEXT FRAME -----*/
      setTimeout(() => {
        yourBombs = yourBombs.filter((bomb) => {
          return bomb.id !== bombInfo.id
        })
        yourBombMeshes = yourBombMeshes.filter(mesh => {
          return newBomb.bombMesh.id !== mesh.id
        })
      }, 1800)

      /*----- ADD BOMB & MESH TO YOUR BOMBS ARR -----*/ 
      yourBombs.push(bombInfo)
      bombObjects.push(newBomb)
      yourBombMeshes.push(newBomb.bombMesh);

      /*----- GET DIRECTION USING FUNCTION -----*/
      getShootDir(projector, camera, shootDirection);

      /*----- GIVES BOMB A SHOOT VELOCITY -----*/
      newBomb.bombBody.velocity.set(shootDirection.x * velocity,
        shootDirection.y * velocity,
        shootDirection.z * velocity);

      /*----- SHOOT YOUR BOMB -----*/
      x += shootDirection.x * (sphereShape.radius * 1.02 + newBomb.bombShape.radius);
      y += shootDirection.y * (sphereShape.radius * 1.02 + newBomb.bombShape.radius);
      z += shootDirection.z * (sphereShape.radius * 1.02 + newBomb.bombShape.radius);
      newBomb.bombBody.position.set(x, y, z);
      newBomb.bombMesh.position.set(x, y, z);
    }
  }

  if (controls) {
    window.addEventListener('click', function(e) {
      shootBomb(8)
    })
    window.addEventListener('keydown', function(event) {
      if (event.keyCode === 32) {
        shootBomb(40)
      }
    })
  }

  /*----- PLAYERS STILL RECEIVE GAMESTATE WHEN INACTIVE-----*/
  setInterval(() => {
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
    counter++;

    /*----- SETS PLAYER SPAWN AFTER GETTING INIT STATE FROM SOCKETS -----*/
    if (counter === 50) {
      sphereBody.position.x = spawnPositions[playerArr.indexOf(socket.id)].x;
      sphereBody.position.y = 5
      sphereBody.position.z = spawnPositions[playerArr.indexOf(socket.id)].z;
    }

    /*----- ALLOWS WALKING IN CANNONJS -----*/
    world.step(dt);

    /*----- GETS CURRENT STATE -----*/
    const state = store.getState();
    const others = state.players;
    const playerIds = Object.keys(others)
    const allBombs = state.bombs;
    const stateBombs = [];

    for (let key in allBombs) {
      let userBombs = allBombs[key].map((bomb) => {
        bomb.userId = key
        return bomb
      })
      stateBombs.push(...userBombs)
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
        /*----- CHECKS IF PLAYER HAS NICKNAME BEFORE CREATING NEW PLAYER -----*/
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

    /*----- ADDS NEW BOMB IF THERE IS ONE -----*/
    if (stateBombs.length > prevStateLength) {
      const mostRecentBomb = stateBombs[stateBombs.length - 1]
      const newBomb = new Bomb(mostRecentBomb.id, mostRecentBomb.position, bombMaterial, mostRecentBomb.userId)
      newBomb.init()

      bombs.push(newBomb.bombBody)
      bombObjects.push(newBomb)
      bombMeshes.push(newBomb.bombMesh)
    }
    /*----- RESTS PREV STATE LENGTH -----*/
    prevStateLength = stateBombs.length

    /*----- ANIMATE FIRE W/ BOMB -----*/
    dead = animateFire(bombObjects, clock, dead)

    /*----- UPDATE PLAYER POSITIONS -----*/
    animatePlayers(players, playerIds, others, playerMeshes)
    
    /*----- ANIMATE EXPLOSION PARTICLES -----*/
    animateExplosion(blocksObj)

    /*----- ANIMATE BOMB POSITIONS -----*/
    animateBombs(yourBombs, yourBombMeshes, bombs, stateBombs, bombMeshes, prevStateLength)

  }, 1000 / 60)
}

export function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

/*----- ANIMATION GAME LOOP & THROTTLE LOOP-----*/
export function animate() {
  setTimeout(() => {
    requestAnimationFrame(animate);
  }, 1000 / 60)

  controls.update(Date.now() - time);
  renderer.render(scene, camera);
  time = Date.now();
}

/*----- CLEAR AND REBUILD MAP TO RESTART & RESPAWN PLAYER -----*/
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

export {
  scene,
  camera,
  renderer,
  controls,
  light,
  world,
  dead
}
