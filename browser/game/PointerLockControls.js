
const THREE = require('three')
const CANNON = require('cannon')

export const PointerLockControls = function(camera, cannonBody) {

    var eyeYPos = 2; // eyes are 2 meters above the ground
    var velocityFactor = 0.4;
    var jumpVelocity = 20;
    var scope = this;

    var pitchObject = new THREE.Object3D();
    pitchObject.add(camera);

    var moveForward = false;
    var moveBackward = false;
    var moveLeft = false;
    var moveRight = false;

    var yawObject = new THREE.Object3D();
    yawObject.position.y = 2;
    yawObject.add(pitchObject);

    var quat = new THREE.Quaternion();

    var moveForward = false;
    var moveBackward = false;
    var moveLeft = false;
    var moveRight = false;

    var canJump = false;

    var contactNormal = new CANNON.Vec3(); // Normal in the contact, pointing *out* of whatever the player touched
    var upAxis = new CANNON.Vec3(0, 1, 0);
    cannonBody.addEventListener("collide", function(e) {
      var contact = e.contact;

      // contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
      // We do not yet know which one is which! Let's check.
      if (contact.bi.id === cannonBody.id) // bi is the player body, flip the contact normal
        contact.ni.negate(contactNormal);
      else
        contactNormal.copy(contact.ni); // bi is something else. Keep the normal as it is

      // If contactNormal.dot(upAxis) is between 0 and 1, we know that the contact normal is somewhat in the up direction.
      if (contactNormal.dot(upAxis) > 0.5) // Use a "good" threshold value between 0 and 1 here!
        canJump = true;
      // When writing single-line `if` and `else` statements it's best to keep them on one-line for clarity (e.g. to avoid a later dev thinking the indented newline is contained within brackets).
    });

    var velocity = cannonBody.velocity;

    var PI_2 = Math.PI / 2;

    // maybe fix this later to use ray caster instead of yawObject
    var onMouseMove = function(event) {

      if (scope.enabled === false) return;

      var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
      var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

      yawObject.rotation.y -= movementX * 0.002;
      pitchObject.rotation.x -= movementY * 0.002;

      pitchObject.rotation.x = Math.max(-PI_2, Math.min(PI_2, pitchObject.rotation.x));
    };

    var onKeyDown = function(event) {

      switch (event.keyCode) {  // Add a comment somewhere confirming that these breakthroughs are deliberate

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

        case 32: // space
          if (canJump === true) {  // if (canJump)
            velocity.y = jumpVelocity;
          }
          canJump = false;  // Do you ALWAYS want to make `canJump` false, or only when it's `true`?
          break;
      }

    };

    var onKeyUp = function(event) {

      switch (event.keyCode) {

        // If these are all false on keyup, can you just make them all false on any keyup? Or DRY up the code in some other way? Or can you move diagonally in this game?

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
    var inputVelocity = new THREE.Vector3();
    var euler = new THREE.Euler();
    this.update = function(delta) {

      if (scope.enabled === false) return;  // if (!scope.enabled)

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

      // Convert velocity to world coordinates
      euler.x = pitchObject.rotation.x;
      euler.y = yawObject.rotation.y;
      euler.order = "XYZ";
      quat.setFromEuler(euler);
      inputVelocity.applyQuaternion(quat);
      //quat.multiplyVector3(inputVelocity);

      // Add to the object
      velocity.x += inputVelocity.x;
      velocity.z += inputVelocity.z;

      yawObject.position.copy(cannonBody.position);
    };
  };

// THREE.PointerLockControls.prototype = Object.create( THREE.EventDispatcher.prototype );
