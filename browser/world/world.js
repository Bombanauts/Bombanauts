import * as THREE from 'three'
import * as CANNON from 'cannon'

// THREE JS Global Variables
let scene;
let camera;
let renderer;
let geometry;
let materail;
let mesh;

// CANNON JS Global Variables
let world;

// run our init function
init();

// init THREE JS world
export const init = () => {

  // init scene
  scene = new THREE.Scene()

  // init camera
  camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1,2500)

  // add camera to scene
  scene.add(camera)

  // make the ground
  geometry = new THREE.PlaneGeometry(300, 300, 50, 50);

  // rotate ground 90 degrees and give sthe ground a vector representation
  // as in the ground is now a vector instead of just an object
  // allows manipulations like rotation, scale, translation, etc.
  geometry.applyMatrix( new THREE.Matrix4().makeRotationX(-Math.PI / 2))

  // MeshLambertMaterial is a dull kind of color for non shiny non metalic stuff
  // the color code I picked is like dark green because why not? :)
  material = new THREE.MeshLambertMaterial( { color:  0x002600 })

  // make mesh and combine the geometry and styling
  mesh = new THREE.Mesh( geometry, material );

  // add some cool shadow affects;
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  // finally add it to the scene
  scene.add( mesh )

  renderer = new THREE.WebGLRenderer()
  renderer.shadowMapEnabled = true;
  renderer.shadowMapSoft = true;
  renderer.setSize( window.innerWidth, window.innerHeight );

  document.body.appendChild( renderer.domElement );

}

// export const render = () => {

// }

// init CANNON world
// export const initCannon = () {
//   world = new CANNON.World();

// }
