// we need this socket object to send messages to our server
window.socket = io(window.location.origin)


socket.on('connect', function() {
  console.log('I have made a persistent two-way connection to the server!')

  // socket.on('move', function() {
  //   socket.emit('move', {})
  // })

  socket.on('movefwd', function(data) {
    console.log('data: ', data)

  })

  socket.on('movedwn', function(data) {
    console.log('data: ', data)

  })

  socket.on('movelft', function(data) {
    console.log('data: ', data)

  })

  socket.on('moverght', function(data) {
    console.log('data: ', data)

  })
})
