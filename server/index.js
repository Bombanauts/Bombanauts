

const path = require('path');
const chalk = require('chalk');
const http = require('http');
const server = http.createServer();
const port = process.env.PORT || 1337;

const express = require('express');
const app = express();

const socketio = require('socket.io');


server.on('request', app);

// creates a new connection server for web sockets and integrates
// it into our HTTP server
// this needs to be below the server.on('request', app) so that our
// express app takes precedence over our socekt server for typical
// HTTP requests
const io = socketio(server);


// // use socket server as an event emitter in order to listen for new connctions
io.on('connection', function(socket){

  console.log(chalk.blue('A new client has connected'));
  console.log(chalk.yellow('socket id: ', socket.id));
  socket.on('move', () => {
    console.log('It moved')
    socket.emit('fire')
  });

  socket.on('disconnect', function(){
    console.log('socket id ' + socket.id + ' has disconnected. : (');
  })

})

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '..', 'browser', 'index.html'));
});


server.listen(port, function () {
    console.log(`The server is listening on port ${port}!`);
});

