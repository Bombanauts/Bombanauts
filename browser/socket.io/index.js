
// we need this socket object to send messages to our server
var socket = io(window.location.origin);

socket.on('connect', function(){
  console.log('I have made a persistent two-way connection to the server!');
})
