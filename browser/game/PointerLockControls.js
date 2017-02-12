import * as THREE from 'three'
import * as CANNON from 'cannon'

export const PointerLockControls = function(camera, cannonBody) {
  /*----- EYES 2 METERS ABOVE GROUND -----*/
  const eyeYPos = 2;
  const velocityFactor = 0.3;
  const jumpVelocity = 20;
  const scope = this;

  const pitchObject = new THREE.Object3D();
  pitchObject.add(camera);

  let moveForward = false;
  let moveBackward = false;
  let moveLeft = false;
  let moveRight = false;
  let canJump = false;

  const yawObject = new THREE.Object3D();
  yawObject.position.y = 2;
  yawObject.add(pitchObject);
  const quat = new THREE.Quaternion();

  /*----- NORMAL IN CONTACT, POINTING OUT OF WHATEVER PLAYER TOUCHES -----*/
  const contactNormal = new CANNON.Vec3();
  const upAxis = new CANNON.Vec3(0, 1, 0);

  cannonBody.addEventListener('collide', function(e) {
    const contact = e.contact;

    /*----- CONTACT.BI & CONTACT.BJ ARE COLLIDING BODIES -----*/
    if (contact.bi.id === cannonBody.id) contact.ni.negate(contactNormal);

    /*----- CONTACT.NI IS COLLISION NORMAL -----*/
    else contactNormal.copy(contact.ni);

    if (contactNormal.dot(upAxis) > 0.5) canJump = true;
  });

  const velocity = cannonBody.velocity;
  const PI_2 = Math.PI / 2;

  const onMouseMove = function(event) {
    if (scope.enabled === false) return;

    let movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    let movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    yawObject.rotation.y -= movementX * 0.002;
    pitchObject.rotation.x -= movementY * 0.002;
    pitchObject.rotation.x = Math.max(-PI_2, Math.min(PI_2, pitchObject.rotation.x));
  };

  const onKeyDown = function(event) {
    switch (event.keyCode) {
      case 38: // UP
      case 87: // W
        moveForward = true;
        break;

      case 37: // LEFT
      case 65: // A
        moveLeft = true;
        break;

      case 40: // DOWN
      case 83: // S
        moveBackward = true;
        break;

      case 39: // RIGHT
      case 68: // D
        moveRight = true;
        break;
    }
  };

  const onKeyUp = function(event) {
    switch (event.keyCode) {
      case 38:
      case 87:
        moveForward = false;
        break;

      case 37:
      case 65:
        moveLeft = false;
        break;

      case 40:
      case 83:
        moveBackward = false;
        break;

      case 39:
      case 68:
        moveRight = false;
        break;
    }
  };

  document.addEventListener('mousemove', onMouseMove, false);
  document.addEventListener('keydown', onKeyDown, false);
  document.addEventListener('keyup', onKeyUp, false);

  this.enabled = false;

  this.getObject = function() {
    return yawObject;
  };

  this.getDirection = function(targetVec) {
    targetVec.set(0, 0, -1);
    quat.multiplyVector3(targetVec);
  }
  /*----- MOVES CAMERA TO CANNONJS OBJ POSITION -----*/
  /*----- ADDS VELOCITY IF 'RUN' KEY IS DOWN -----*/
  const inputVelocity = new THREE.Vector3();
  const euler = new THREE.Euler();
  this.update = function(delta) {

    if (scope.enabled === false) return;

    delta *= 0.1;

    inputVelocity.set(0, 0, 0);

    if (moveForward) {
      inputVelocity.z = -velocityFactor * delta;
    }

    if (moveBackward) {
      inputVelocity.z = velocityFactor * delta;
    }

    if (moveLeft) {
      inputVelocity.x = -velocityFactor * delta;
    }
    if (moveRight) {
      inputVelocity.x = velocityFactor * delta;
    }

    /*----- CONVERT VELOCITY TO WORLD COORDS -----*/
    euler.x = pitchObject.rotation.x;
    euler.y = yawObject.rotation.y;
    euler.order = 'XYZ';
    quat.setFromEuler(euler);
    inputVelocity.applyQuaternion(quat);

    /*----- ADD TO THE OBJECT -----*/
    velocity.x += inputVelocity.x;
    velocity.z += inputVelocity.z;

    yawObject.position.copy(cannonBody.position);
  };
};
