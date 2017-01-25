// we need this socket object to send messages to our server
window.socket = io(window.location.origin)


socket.on('connect', function() {
  console.log('I have made a persistent two-way connection to the server!')

  // socket.on('move', function() {
  //   socket.emit('move', {})
  // })

  socket.on('movefwd', function(data) {
    console.log('data: ', data)
    const x = data.position.x
    const y = data.position.y
    const z = data.position.z


    var halfExtents = new CANNON.Vec3(1, 1, 1);
    var boxShape = new CANNON.Box(halfExtents);
    var boxGeometry = new THREE.BoxGeometry(halfExtents.x * 2, halfExtents.y * 2, halfExtents.z * 2);
    var boxBody = new CANNON.Body({ mass: 0 });
    boxBody.addShape(boxShape);
    var boxMesh = new THREE.Mesh(boxGeometry, material);
    world.addBody(boxBody);
    scene.add(boxMesh);
    boxBody.position.set(x, y, z);
    boxMesh.position.set(x, y, z);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxes.push(boxBody);
    boxMeshes.push(boxMesh);

  })
})
