const path = require('path');
const chalk = require('chalk');
const http = require('http');
const server = http.createServer();
const port = process.env.PORT || 1337;
const express = require('express');
const app = express();
const socketio = require('socket.io');
const _ = require('lodash');
const { Maps, randomGeneration } = require('./maps/map');
const {updatePlayers, removePlayer, killPlayer} = require('./players/action-creator');
const { addBomb, updateBombPositions, removePlayerBombs, removeBomb } = require('./bombs/action-creator')
const { updateMap, loadMap } = require('./maps/action-creator')

const store = require('./store')
const worldNames = require('./world-names')
server.on('request', app);

// creates a new connection server for web sockets and integrates
// it into our HTTP server
const io = socketio(server)


const roomName = (connectedSocket, roomsList) => {
  let roomsNames = Object.keys(roomsList).filter( room => {
    return room.length < 12
  });
  let currentRoomName;
  let createdRoom = false;
  if (!roomsNames.length) {
    return {currentRoomName:worldNames[0], createdRoom: true};
  }
  for (let i = 0; i < roomsNames.length; i++) {
    if (roomsList[roomsNames[i]].length < 4) {
      currentRoomName = roomsNames[i];
      break;
    } else if (i === roomsNames.length - 1) {
      connectedSocket.join(worldNames[i + 1]);
      currentRoomName = worldNames[i + 1];
      createdRoom = true;
    }
  }
  return {currentRoomName, createdRoom};
}

//  use socket server as an event emitter in order to listen for new connctions
io.on('connection', (socket) => {
  delete socket.adapter.rooms[socket.id]
  let rooms = io.sockets.adapter.rooms;
  let {currentRoomName, createdRoom} = roomName(socket, rooms)
  socket.join(currentRoomName);
  socket.currentRoom = currentRoomName;

  let currState = store.getState();

  if (createdRoom) {
    io.sockets.emit('initial', {
      players: [],
      bombs: {
        allBombs: []
      },
      mapState: {
        mapState: Maps[0]
      }
    });
  } else {
    let newState = {
      players: currState.players[socket.currentRoom],
      bombs: currState.bombs[socket.currentRoom],
      mapState: currState.mapState[socket.currentRoom]
    };
    io.sockets.emit('initial', newState);
    console.log(chalk.blue('A new client has connected'));
    console.log(chalk.yellow('socket id: ', socket.id));
  }

  socket.on('get_players', () => {
    socket.emit('get_players', store.getState().players[socket.currentRoom]);
  })

  socket.on('update_world', (data) => {
    store.dispatch(updatePlayers({ id: data.playerId, position: data.playerPosition, dead: data.dead }, socket.currentRoom));
    store.dispatch(updateBombPositions({ userId: data.playerId, bombs: data.playerBombs }, socket.currentRoom))
    let currState = store.getState();
    let newState = {
      players: currState.players[socket.currentRoom],
      bombs: currState.bombs[socket.currentRoom],
      mapState: currState.mapState[socket.currentRoom]
    };
    io.in(socket.currentRoom).emit('update_world', newState)
  })

  //add new bomb to the state when a player clicks
  socket.on('add_bomb', (data) => {
    store.dispatch(addBomb(data, socket.currentRoom))
    io.in(socket.currentRoom).emit('update_bomb_positions', store.getState().bombs[socket.currentRoom].allBombs)
  })

  //kill player on bomb collision
  socket.on('kill_player', (data) => {
    store.dispatch(killPlayer(data.id, socket.currentRoom))
    io.in(socket.currentRoom).emit('kill_player', data.id)
    let currState = store.getState();
    let newState = {
      players: currState.players[socket.currentRoom],
      bombs: currState.bombs[socket.currentRoom],
      mapState: currState.mapState[socket.currentRoom]
    };
    io.in(socket.currentRoom).emit('update_world', newState)
  })

  socket.on('destroy_cube', (data) => {
    store.dispatch(updateMap(data, socket.currentRoom))
  })


  // FIX THIS
  socket.on('reset_world', (data) => {
    let newMap = randomGeneration(Maps[0])
    console.log(newMap)

    store.dispatch(loadMap(newMap, socket.currentRoom))

    io.in(socket.currentRoom).emit('reset_world', {
      players: store.getState().players[socket.currentRoom],
      bombs: {
        allBombs: []
      },
      mapState: {
        mapState: newMap
      }
    })
  })

  //remove the player from the state on socket disconnect
  socket.on('disconnect', () => {
    store.dispatch(removePlayer(socket.id, socket.currentRoom))
    store.dispatch(removePlayerBombs(socket.id, socket.currentRoom))

    io.in(socket.currentRoom).emit('remove_player', socket.id)
    console.log('socket id ' + socket.id + ' has disconnected. : (');
  })
})

app.use(express.static(path.join(__dirname, '..', 'public', 'assets')));

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});


server.listen(port, function () {
    console.log(`The server is listening on port ${port}!`);
});
