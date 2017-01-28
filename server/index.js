const path = require('path');
const chalk = require('chalk');
const http = require('http');
const server = http.createServer();
const port = process.env.PORT || 1337;
const express = require('express');
const app = express();
const socketio = require('socket.io');

const {updatePlayers, removePlayer} = require('./players/action-creator');
const { addBomb, updateBombPositions } = require('./bombs/action-creator')

const store = require('./store')


server.on('request', app);


// creates a new connection server for web sockets and integrates
// it into our HTTP server
const io = socketio(server)


//  use socket server as an event emitter in order to listen for new connctions
io.on('connection', (socket) => {

  console.log(chalk.blue('A new client has connected'));
  console.log(chalk.yellow('socket id: ', socket.id));

  //on connection add this new player to our store
  store.dispatch(updatePlayers({id: socket.id,
                                position: {x: 0, y: 0, z: 0}
                              }));

  //constantly send out all the player locations to everyone
  socket.on('update_players_position', (data) => {
    store.dispatch(updatePlayers(data));
    io.sockets.emit('update_player_locations', store.getState().players)
  })

  //add new bomb to the state when a player clicks
  socket.on('add_bomb', (data) => {
    // console.log('data: ', data)
    store.dispatch(addBomb(data))
    console.log(store.getState())
    io.sockets.emit('update_bomb_positions', store.getState().bombs)
  })

  //constantly receive and update all bomb positions coming from each user
  socket.on('update_bomb_positions', (data) => {
    store.dispatch(updateBombPositions(data))
    io.sockets.emit('update_bomb_positions', store.getState().bombs)
  })

  //remove the player from the state on socket disconnect
  socket.on('disconnect', () => {
    store.dispatch(removePlayer(socket.id))
    io.sockets.emit('remove_player', socket.id)

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

