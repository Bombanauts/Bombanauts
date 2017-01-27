
const THREE = require('three')
const CANNON = require('cannon')
// const PointerLockControls = require('./PointerLockControls');
import store from '../store';

import { PointerLockControls } from './PointerLockControls';
import Player from './Player'

var sphereShape, sphereBody, world, physicsMaterial, walls=[], balls=[], ballMeshes=[], boxes=[], boxMeshes=[], players=[], playerMeshes=[];
var camera, scene, renderer, light;
var geometry, material, mesh;
var controls,time = Date.now();

export function initCannon() {
//     // Setup our world
    world = new CANNON.World();
    world.quatNormalizeSkip = 0;
    world.quatNormalizeFast = false;
    var solver = new CANNON.GSSolver();
    world.defaultContactMaterial.contactEquationStiffness = 1e9;
    world.defaultContactMaterial.contactEquationRelaxation = 4;
    solver.iterations = 7;
    solver.tolerance = 0.1;
    var split = true;
    if(split)
        world.solver = new CANNON.SplitSolver(solver);
    else
        world.solver = solver;
    world.gravity.set(0,-20,0);
    world.broadphase = new CANNON.NaiveBroadphase();

//     // Create a slippery material (friction coefficient = 0.0)
    physicsMaterial = new CANNON.Material("slipperyMaterial");
    var physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial,
                                                            physicsMaterial,
                                                            0.0, // friction coefficient
                                                            0.3  // restitution
                                                            );
//     // We must add the contact materials to the world
    world.addContactMaterial(physicsContactMaterial);

//     // Create a sphere
    var mass = 5, radius = 1.3;
    sphereShape = new CANNON.Sphere(radius);
    sphereBody = new CANNON.Body({ mass: mass });
    sphereBody.addShape(sphereShape);
    sphereBody.position.set(0,5,0);
    sphereBody.linearDamping = 0.9;
    world.addBody(sphereBody);

    // Create a plane
    var groundShape = new CANNON.Plane();
    var groundBody = new CANNON.Body({ mass: 0 });
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
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
    camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(0, 3, 0)
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0x000000, 0, 500 );
    var ambient = new THREE.AmbientLight( 0xffffff );
    scene.add( ambient );
    light = new THREE.SpotLight( 0xffffff );
    light.position.set( 10, 30, 20 );
    light.target.position.set( 0, 0, 0 );
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
    scene.add( light );

    // this attaches bomb to the player (maybe)
    // look at PointerLockControls function
    // sphereBody.position = (0,5,0) so the sphere should be 5+ in y direction above camera

    controls = new PointerLockControls( camera , sphereBody );
    scene.add( controls.getObject() );

    // floor
    geometry = new THREE.PlaneBufferGeometry( 125, 125, 50, 50 );
    geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
    material = new THREE.MeshLambertMaterial( { color: 0x3f7cba } );
    mesh = new THREE.Mesh( geometry, material );
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add( mesh );

    renderer = new THREE.WebGLRenderer();
    // renderer.shadowMapEnabled = true;
    // renderer.shadowMapSoft = true;
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( scene.fog.color, 1 );
    document.body.appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize, false );

    createMap();

    let { players } = store.getState();
    let newPlayer;

    console.log(players.otherPlayers)

      for (var key in players.otherPlayers) {
        console.log('key', key)
        newPlayer = new Player(id, key.x, key.y, key.z)
        newPlayer.init()
      }

    // add event listen to actually shoot
  if (controls) {
    window.addEventListener("click",function(e){
      if(controls.enabled==true){
          // because sphereBody position is dependent on camera position
          var x = sphereBody.position.x;
          var y = sphereBody.position.y;
          var z = sphereBody.position.z;

          // create the ball
          var ballBody = new CANNON.Body({ mass: 1 });
          ballBody.addShape(ballShape);
          var ballMesh = new THREE.Mesh( ballGeometry, material );
          world.addBody(ballBody);

          // add it to the scene
          scene.add(ballMesh);

          // shadow affects
          ballMesh.castShadow = true;
          ballMesh.receiveShadow = true;

          // push it into our global balls array

          balls.push(ballBody);

          // push ball meshes
          ballMeshes.push(ballMesh);

          // get its direction using getShootDir function
          // returns shootDirection altered with correct data
          getShootDir(shootDirection);


          // give it a velocity
          // shootVelo is global defined as 15
          ballBody.velocity.set(  shootDirection.x * shootVelo,
                                  shootDirection.y * shootVelo,
                                  shootDirection.z * shootVelo);

          // Move the ball outside the player sphere
          // not sure about this shit here
          // x,y,z adjusted so it's actually updating the position of the sphere
          x += shootDirection.x * (sphereShape.radius*1.02 + ballShape.radius);
          y += shootDirection.y * (sphereShape.radius*1.02 + ballShape.radius);
          z += shootDirection.z * (sphereShape.radius*1.02 + ballShape.radius);
          ballBody.position.set(x,y,z);
          ballMesh.position.set(x,y,z);
      }
    });
  }
}

export function createMap() {
  // Add boxes
    var halfExtents = new CANNON.Vec3(2,2,2);
    var boxShape = new CANNON.Box(halfExtents);
    var boxGeometry = new THREE.BoxGeometry(halfExtents.x*1.9,halfExtents.y*1.9,halfExtents.z*1.9);

    var wallShape = new CANNON.Box(halfExtents);
    var wallGeometry = new THREE.BoxGeometry(halfExtents.x*2,halfExtents.y*3.5,halfExtents.z*2);

    // // Map 1 = Wall, 2 = StaticBox
    let map = [ // 1  2  3  4  5  6  7  8  9  10 11 12
               [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // 0
               [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 1
               [1, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 1], // 2
               [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 3
               [1, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 1], // 4
               [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 5
               [1, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 1], // 6
               [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 7
               [1, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 1], // 8
               [1, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 1], // 9
               [1, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 1], // 10
               [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 11
               [1, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 1], // 12
               [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 13
               [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // 14
               ]


  let mapW = map.length, mapH = map[0].length;

  for (let j = 0; j < mapW; j++) {
    for (let k = 0; k < mapH; k++) {

      let x = (j + mapW) * 4 - 100;
      let y = 2
      let z = -(k + mapW) * 4 + 100;

      if (map[j][k] === 2) { // create box

        var boxBody = new CANNON.Body({ mass: 0 }); //
        boxBody.addShape(boxShape) //
        var boxMesh = new THREE.Mesh( boxGeometry, material );
        world.addBody(boxBody); //
        scene.add(boxMesh);
        boxBody.position.set(x,y,z);
        boxMesh.position.set(x,y,z);
        boxMesh.castShadow = true;
        boxMesh.receiveShadow = true;
        boxes.push(boxBody);
        boxMeshes.push(boxMesh);

      } else if (map[j][k] === 1){ // create wall

        var wallBody = new CANNON.Body({ mass: 0 }); //
        wallBody.addShape(wallShape); //
        var wallMesh = new THREE.Mesh( wallGeometry, material );
        world.addBody(wallBody);//
        scene.add(wallMesh);
        wallBody.position.set(x,y,z); //
        wallMesh.position.set(x,y,z);
        wallMesh.castShadow = true;
        wallMesh.receiveShadow = true;
        boxes.push(wallBody);
        boxMeshes.push(wallMesh);

      } else if (map[j][k] === 3){ // create wall

        var boxBody = new CANNON.Body({ mass: 1 }); //
        boxBody.addShape(boxShape) //
        let color = new THREE.MeshLambertMaterial( { color: 0x8B4513 } );
        var boxMesh = new THREE.Mesh( boxGeometry, color );
        world.addBody(boxBody); //
        scene.add(boxMesh);
        boxBody.position.set(x,y,z);
        boxMesh.position.set(x,y,z);
        boxMesh.castShadow = true;
        boxMesh.receiveShadow = true;
        boxes.push(boxBody);
        boxMeshes.push(boxMesh);
      }

    }
  }
}

export function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

var dt = 1/60; // change in time for walking

  // animate the walking and the box positions movements

export function animate() {

    setTimeout(() => {
      if(socket) {
        socket.emit('update_players_position', {
            position: {
              x: sphereBody.position.x,
              y: sphereBody.position.y,
              z: sphereBody.position.z
            },
            id: socket.id
        });
      }
      requestAnimationFrame( animate );
    }, 1000 / 45)
    if(controls.enabled){
        world.step(dt); // function that allows walking from CANNON

        // Update ball positions
        // the bombs in our game

        // UPDATES PLAYERS HERE

        let state = store.getState();
        let playerIds = Object.keys(state.players.otherPlayers)

        if (playerIds.length > players.length) {
          var halfExtents = new CANNON.Vec3(2,2,2);
          var boxShape = new CANNON.Box(halfExtents);
          var boxGeometry = new THREE.BoxGeometry(halfExtents.x*1.9,halfExtents.y*1.9,halfExtents.z*1.9);

          var playerBox = new CANNON.Body({ mass: 1 }); //
          playerBox.addShape(boxShape) //
          let color = new THREE.MeshLambertMaterial( { color: 0x8B4513 } );
          var playerMesh = new THREE.Mesh( boxGeometry, color );
          world.addBody(playerBox); //
          scene.add(playerMesh);
          let pos = state.players.otherPlayers[playerIds[playerIds.length - 1]];

          let {x, y, z} = pos;


          playerBox.position.set(x, y + 5, z);
          playerMesh.position.set(x, y + 5, z);
          playerMesh.castShadow = true;
          playerMesh.receiveShadow = true;
          players.push(playerBox);
          playerMeshes.push(playerMesh);
        }

        for(let i=0; i < players.length; i++){

            playerMeshes[i].position.copy(state.players.otherPlayers[playerIds[i]]);
            playerMeshes[i].quaternion.copy(players[i].quaternion);
        }

        for(let i=0; i<balls.length; i++){
            ballMeshes[i].position.copy(balls[i].position);
            ballMeshes[i].quaternion.copy(balls[i].quaternion);
        }
        // // Update box positions
        for(let i=0; i<boxes.length; i++){
            boxMeshes[i].position.copy(boxes[i].position);
            boxMeshes[i].quaternion.copy(boxes[i].quaternion);
        }
    }

    controls.update( Date.now() - time );
    renderer.render( scene, camera );
    time = Date.now();
}




  // this is outdated should use raycaster instead since it gives more info anyway
  // also projector is moved.
  // to adjust to use raycaster we need to adjust yawObject and pitch object

  TODO: // HERE
var projector = new THREE.Projector();

// get shoot direction might need to be adjusted to use ray caster instead
const getShootDir = function(targetVec){
    var vector = targetVec;
    targetVec.set(0,0,1);
    projector.unprojectVector(vector, camera);
    var ray = new THREE.Ray(sphereBody.position, vector.sub(sphereBody.position).normalize() );
    targetVec.copy(ray.direction);
}

export { scene, camera, renderer, controls, light, getShootDir }
