const path = require('path');
const chalk = require('chalk');
const http = require('http');
const server = http.createServer();
const port = process.env.PORT || 1337;
const express = require('express');
const app = express();
const socketio = require('socket.io')
const {
  Maps,
  randomGeneration
} = require('./maps/map');

const {
  updateMap,
  loadMap
} = require('./maps/action-creator')
const {
  updatePlayers,
  removePlayer,
  killPlayer,
  setNickname,
  incrementScore,
  decrementScore
} = require('./players/action-creator');
const {
  addBomb,
  updateBombPositions,
  removePlayerBombs,
  removeBomb
} = require('./bombs/action-creator')
const {
  setTime,
  getTime
} = require('./timer/action-creator')
const { setWinner } = require('./winner/action-creator')
const {
  roomName,
  convertStateForFrontEnd,
  resetWorld
} = require('./utils')

const store = require('./store')
const worldNames = require('./world-names')
server.on('request', app);


// creates a new connection server for web sockets and integrates
// it into our HTTP server
const io = socketio(server)

//  use socket server as an event emitter in order to listen for new connections
io.on('connection', (socket) => {
    //manage which room the connected socket is joining (4 sockets max to a room)
  delete socket.adapter.rooms[socket.id]
  let rooms = io.sockets.adapter.rooms;
  let { currentRoomName, createdRoom } = roomName(socket, rooms)

  socket.join(currentRoomName);
  socket.currentRoom = currentRoomName;

  let currState;

  if (createdRoom) {
    //initial setup for a new room
    let randomMap = randomGeneration(Maps)
    store.dispatch(loadMap(randomMap, socket.currentRoom))
    let currentTime = Date.now();

    store.dispatch(setTime(currentTime, socket.currentRoom))
    store.dispatch(getTime(socket.currentRoom))
    currState = convertStateForFrontEnd(store.getState(), socket.currentRoom);
    socket.emit('initial', currState);
  } else {
    //joining a room
    currState = convertStateForFrontEnd(store.getState(), socket.currentRoom);
    socket.emit('initial', currState);
  }

  console.log(chalk.blue('A new client has connected'));
  console.log(chalk.yellow('socket id: ', socket.id));

  socket.on('set_nickname', (nickname) => {
    store.dispatch(setNickname(socket.id, nickname, socket.currentRoom))
  })

  socket.on('get_players', () => {
    socket.emit('get_players', store.getState().players[socket.currentRoom]);
  })

  //the primary socket emission, used 60x a second to update all player and bomb data
  socket.on('update_world', (data) => {
    store.dispatch(updatePlayers({ id: data.playerId, position: data.playerPosition, dead: data.dead, nickname: data.nickname }, socket.currentRoom));
    store.dispatch(updateBombPositions({ userId: data.playerId, bombs: data.playerBombs }, socket.currentRoom))
    store.dispatch(getTime(socket.currentRoom))

    let newState = convertStateForFrontEnd(store.getState(), socket.currentRoom)

    //restart the world if the timer hits 0
    if (newState.timer <= 0) {
      resetWorld(Maps, socket.currentRoom, io)
    } else {
      io.in(socket.currentRoom).emit('update_world', newState)
    }
  })

  //add new bomb to the state when a player clicks
  socket.on('add_bomb', (data) => {
    store.dispatch(addBomb(data, socket.currentRoom))
    io.in(socket.currentRoom).emit('update_bomb_positions', store.getState().bombs[socket.currentRoom])
  })

  //kill player on bomb collision
  socket.on('kill_player', (data) => {
    let room = socket.currentRoom;
    store.dispatch(killPlayer(data.id, room))

    if (data.id !== data.killedBy) {
      store.dispatch(incrementScore(data.killedBy, room))
    } else {
      store.dispatch(decrementScore(data.killedBy, room))
    }

    let currentState = store.getState();
    let currentPlayers = currentState.players[room];
    let killerNickname = currentPlayers[data.killedBy]
    let victimNickname = currentPlayers[data.id];

    data.killerNickname = killerNickname;
    data.victimNickname = victimNickname;
    io.in(room).emit('kill_player', data)

    if (currentPlayers) {
      let currentPlayersIds = Object.keys(currentPlayers)
      let currentPlayersLength = currentPlayersIds.length
      let alivePlayers = []

      for (let player in currentPlayers) {
        if (!currentPlayers[player].dead) {
          currentPlayers[player].socketId = player
          alivePlayers.push(currentPlayers[player])
        }
      }

      //win conditions for if only one player is left alive, or if a solo player dies
      if (currentPlayersLength >= 1 && alivePlayers.length <= 1) {
        if (alivePlayers[0]) store.dispatch(setWinner(alivePlayers[0].socketId, room))
        else {
          let state = store.getState();
          io.in(room).emit('reset_world', {
            players: state.players[room],
            bombs: {},
            map: state.map[room],
            timer: state.timer[room].currTime,
            dead: false
          })
        }
      }
    }

    currentState = store.getState();
    let newState = convertStateForFrontEnd(currentState, room)
    io.in(room).emit('set_winner', newState.winner)
    io.in(room).emit('update_world', newState)
  })

  //chat messages
  socket.on('new_message', (data) => {
    let currentState = store.getState();
    let room = socket.currentRoom;
    let currentPlayers = currentState.players[room];
    let playerNickname;
    if (currentPlayers[data.id] && currentPlayers[data.id].nickname) {
      playerNickname = currentPlayers[data.id].nickname
    }
    else {
      playerNickname = ''
    }
    io.in(socket.currentRoom).emit('new_message', `${playerNickname} : ${data.message}`)
  })

  //change the map on the state when a crate is destroyed
  socket.on('destroy_cube', (data) => {
    store.dispatch(updateMap(data, socket.currentRoom))
  })

  //restart the entire world on game end
  socket.on('reset_world', (data) => {
    resetWorld(Maps, socket.currentRoom, io)
  })

  //remove the player from the state on socket disconnect
  socket.on('disconnect', () => {
    store.dispatch(removePlayer(socket.id, socket.currentRoom))
    store.dispatch(removePlayerBombs(socket.id, socket.currentRoom))
    let currentStatePlayers = store.getState().players[socket.currentRoom];
    if (currentStatePlayers) {
      let currentPlayersLength = Object.keys(currentStatePlayers).length;
      if (!currentPlayersLength) {
        store.dispatch(setWinner(null, socket.currentRoom))
      }
    }
    io.in(socket.currentRoom).emit('remove_player', socket.id)
    console.log('socket id ' + socket.id + ' has disconnected. : (');
  })
})

app.use(express.static(path.join(__dirname, '..', 'public', 'assets')));

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

server.listen(port, function() {
  console.log(`The server is listening on port ${port}!`);
});
