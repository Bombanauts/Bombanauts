
// we need this socket object to send messages to our server
var socket = io(window.location.origin);


socket.on('connect', function(){
  console.log('I have made a persistent two-way connection to the server!')

  window.addEventListener('click', function(){
      socket.emit('move')
  })

  socket.on('fire', function() {
      console.log('You are')
    if(controls.enabled==true){
                    var x = sphereBody.position.x;
                    var y = sphereBody.position.y;
                    var z = sphereBody.position.z;
                    var ballBody = new CANNON.Body({ mass: 1 });
                    ballBody.addShape(ballShape);
                    var ballMesh = new THREE.Mesh( ballGeometry, material );
                    world.addBody(ballBody);
                    scene.add(ballMesh);
                    ballMesh.castShadow = true;
                    ballMesh.receiveShadow = true;
                    balls.push(ballBody);
                    ballMeshes.push(ballMesh);
                    getShootDir(shootDirection);
                    ballBody.velocity.set(  shootDirection.x * shootVelo,
                                            shootDirection.y * shootVelo,
                                            shootDirection.z * shootVelo);
                    // Move the ball outside the player sphere
                    x += shootDirection.x * (sphereShape.radius*1.02 + ballShape.radius);
                    y += shootDirection.y * (sphereShape.radius*1.02 + ballShape.radius);
                    z += shootDirection.z * (sphereShape.radius*1.02 + ballShape.radius);
                    ballBody.position.set(x,y,z);
                    ballMesh.position.set(x,y,z);
                }
  })

})
