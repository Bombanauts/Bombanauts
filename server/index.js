

var path = require('path');
var chalk = require('chalk');
var http = require('http');
var server = http.createServer();

var express = require('express');
var app = express();


var socketio = require('socket.io');

server.on('request', app);


// creates a new connection server for web sockets and integrates
// it into our HTTP server
// this needs to be below the server.on('request', app) so that our
// express app takes precedence over our socekt server for typical
// HTTP requests
var io = socketio(server);


// // use socket server as an event emitter in order to listen for new connctions
io.on('connection', function(socket){

  console.log(chalk.blue('A new client has connected'));
  console.log(chalk.yellow('socket id: ', socket.id));

  socket.on('disconnect', function(){
    console.log('socket id ' + socket.id + ' has disconnected. : (');
  })

})

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '..', 'browser', 'index.html'));
});


server.listen(1337, function () {
    console.log('The server is listening on port 1337!');
});

