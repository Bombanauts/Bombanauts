const THREE = require('three')
const CANNON = require('cannon')

export const PointerLockControls = function(camera, cannonBody) {

  const eyeYPos = 2; // eyes are 2 meters above the ground  // !! Wow, tall dude
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

  const contactNormal = new CANNON.Vec3(); // Normal in the contact, pointing *out* of whatever the player touched
  const upAxis = new CANNON.Vec3(0, 1, 0);

  cannonBody.addEventListener('collide', function(e) {
    const contact = e.contact;

    // Are these properties provided or can you rename them more descriptively -- esp. considering the below comments?
    // contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
    // bi is the player body, flip the contact normal
    if (contact.bi.id === cannonBody.id) contact.ni.negate(contactNormal);

    else contactNormal.copy(contact.ni);

    if (contactNormal.dot(upAxis) > 0.5) canJump = true;
  });

  const velocity = cannonBody.velocity;
  const PI_2 = Math.PI / 2;

  // maybe fix this later to use ray caster instead of yawObject
  const onMouseMove = function(event) {
    if (scope.enabled === false) return;

    let movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    let movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    yawObject.rotation.y -= movementX * 0.002;
    pitchObject.rotation.x -= movementY * 0.002;
    pitchObject.rotation.x = Math.max(-PI_2, Math.min(PI_2, pitchObject.rotation.x));
  };

  // Is there a way to DRY this up? Do you really need all these cases? Util function maybe?
  const onKeyDown = function(event) {
    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        moveForward = true;
        break;

      case 37: // left
      case 65: // a
        moveLeft = true;
        break;

      case 40: // down
      case 83: // s
        moveBackward = true;
        break;

      case 39: // right
      case 68: // d
        moveRight = true;
        break;

    }
  };

  const onKeyUp = function(event) {
    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        moveForward = false;
        break;

      case 37: // left
      case 65: // a
        moveLeft = false;
        break;

      case 40: // down
      case 83: // a
        moveBackward = false;
        break;

      case 39: // right
      case 68: // d
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

  // Moves the camera to the Cannon.js object position and adds velocity to the object if the run key is down
  const inputVelocity = new THREE.Vector3();
  const euler = new THREE.Euler();
  this.update = function(delta) {

    if (scope.enabled === false) return;

    delta *= 0.1;

    inputVelocity.set(0, 0, 0);

    // DRY up with util function?
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

    // Convert velocity to world coordinates
    euler.x = pitchObject.rotation.x;
    euler.y = yawObject.rotation.y;
    euler.order = 'XYZ';
    quat.setFromEuler(euler);
    inputVelocity.applyQuaternion(quat);

    // Add to the object
    velocity.x += inputVelocity.x;
    velocity.z += inputVelocity.z;

    yawObject.position.copy(cannonBody.position);
  };
};

