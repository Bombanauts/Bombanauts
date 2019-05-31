const path = require('path');
const chalk = require('chalk');
const http = require('http');
const server = http.createServer();
const port = process.env.PORT || 1337;
const express = require('express');
const expressStaticGzip = require('express-static-gzip');
const app = express();
const socketio = require('socket.io');

const { Maps, randomGeneration } = require('./redux/maps/map');
const { updateMap, loadMap } = require('./redux/maps/action-creator');
const { updatePlayers, removePlayer, killPlayer, setNickname,
  incrementScore, decrementScore } = require('./redux/players/action-creator');
const { addBomb, updateBombPositions, removePlayerBombs } = require('./redux/bombs/action-creator');
const { setTime, getTime } = require('./redux/timer/action-creator');
const { setWinner } = require('./redux/winner/action-creator');
const { roomName, convertStateForFrontEnd, resetWorld } = require('./utils');
const store = require('./redux/store');

server.on('request', app);

/* CREATES NEW CONNECTION SERVIER FOR SOCKETS & INTEGRATES HTTP SERVER */
const io = socketio(server);

/*----- USES SOCKET AS EVENT EMITTER TO LISTEN FOR NEW CONNECTIONS -----*/
io.on('connection', (socket) => {
  /*----- MANAGES WHICH ROOM CONNECTED SOCKET IS JOINING (4 MAX) -----*/
  delete socket.adapter.rooms[socket.id];
  const rooms = io.sockets.adapter.rooms;
  const { currentRoomName, createdRoom } = roomName(socket, rooms);

  socket.join(currentRoomName);
  socket.currentRoom = currentRoomName;

  let currState;

  if (createdRoom) {
    /*----- INITIAL SET UP FOR NEW ROOM -----*/
    const randomMap = randomGeneration(Maps);
    store.dispatch(loadMap(randomMap, socket.currentRoom));
    const currentTime = Date.now();

    store.dispatch(setTime(currentTime, socket.currentRoom));
    store.dispatch(getTime(socket.currentRoom));
    currState = convertStateForFrontEnd(store.getState(), socket.currentRoom);
    socket.emit('initial', currState);
  } else {
    /*----- JOINING ROOM -----*/
    currState = convertStateForFrontEnd(store.getState(), socket.currentRoom);
    socket.emit('initial', currState);
  }

  console.log(chalk.blue('A new client has connected'));
  console.log(chalk.yellow('socket id: ', socket.id));

  socket.on('set_nickname', (nickname) => {
    store.dispatch(setNickname(socket.id, nickname, socket.currentRoom));
    io.in(socket.currentRoom).emit('new_message', `${nickname} has joined the game!`);
  });

  socket.on('get_players', () => {
    socket.emit('get_players', store.getState().players[socket.currentRoom]);
  });

  /*----- PRIMARY SOCKET EMISSION, 60X/SEC TO UPDATE ALL PLAYER & BOMB DATA -----*/
  socket.on('update_world', (data) => {
    store.dispatch(updatePlayers({ id: data.playerId, position: data.playerPosition, dead: data.dead, nickname: data.nickname }, socket.currentRoom));
    store.dispatch(updateBombPositions({ userId: data.playerId, bombs: data.playerBombs }, socket.currentRoom));
    store.dispatch(getTime(socket.currentRoom));

    const newState = convertStateForFrontEnd(store.getState(), socket.currentRoom);

    /*----- RESTART WORLD IF TIMER IS 0 -----*/
    if (newState.timer <= 0) {
      resetWorld(Maps, socket.currentRoom, io);
    } else {
      io.in(socket.currentRoom).emit('update_world', newState);
    }
  })

  /*----- ADD NEW BOMB TO STATE ON CLICK -----*/
  socket.on('add_bomb', (data) => {
    store.dispatch(addBomb(data, socket.currentRoom));
    io.in(socket.currentRoom).emit('update_bomb_positions', store.getState().bombs[socket.currentRoom]);
  });

  /*----- KILL PLAYER ON BOMB COLLISION -----*/
  socket.on('kill_player', (data) => {
    const room = socket.currentRoom;
    store.dispatch(killPlayer(data.id, room));

    if (data.id !== data.killedBy) {
      store.dispatch(incrementScore(data.killedBy, room));
    } else {
      store.dispatch(decrementScore(data.killedBy, room));
    }

    let currentState = store.getState();
    const currentPlayers = currentState.players[room];
    const killerNickname = currentPlayers[data.killedBy];
    const victimNickname = currentPlayers[data.id];

    data.killerNickname = killerNickname;
    data.victimNickname = victimNickname;
    io.in(room).emit('kill_player', data);

    if (currentPlayers) {
      const currentPlayersIds = Object.keys(currentPlayers);
      const currentPlayersLength = currentPlayersIds.length;
      const alivePlayers = [];

      for (let player in currentPlayers) {
        if (!currentPlayers[player].dead) {
          currentPlayers[player].socketId = player;
          alivePlayers.push(currentPlayers[player]);
        }
      }

      /*----- WIN CONDITIONS FOR WHEN 1 PLAYER LEFT OR IF SOLO PLAYER DIES -----*/
      if (currentPlayersLength >= 1 && alivePlayers.length <= 1) {
        if (alivePlayers[0]) {
          store.dispatch(setWinner(alivePlayers[0].socketId, room));
        } else {
          const state = store.getState();
          io.in(room).emit('reset_world', {
            players: state.players[room],
            bombs: {},
            map: state.map[room],
            timer: state.timer[room].currTime,
            dead: false
          });
        }
      }
    }

    currentState = store.getState();
    const newState = convertStateForFrontEnd(currentState, room);
    io.in(room).emit('set_winner', newState.winner);
    io.in(room).emit('update_world', newState);
  });

  /*----- CHAT MESSAGES -----*/
  socket.on('new_message', (data) => {
    const currentState = store.getState();
    const room = socket.currentRoom;
    const currentPlayers = currentState.players[room];
    let playerNickname;
    if (currentPlayers[data.id] && currentPlayers[data.id].nickname) {
      playerNickname = currentPlayers[data.id].nickname;
    } else {
      playerNickname = '';
    }
    io.in(socket.currentRoom).emit('new_message', `${playerNickname} : ${data.message}`);
  });

  /*----- CHANGES MAP ON STATE WHEN BOX IS DESTROYED -----*/
  socket.on('destroy_cube', (data) => {
    store.dispatch(updateMap(data, socket.currentRoom));
  });

  /*----- RESTART WORLD ON GAME END -----*/
  socket.on('reset_world', () => {
    resetWorld(Maps, socket.currentRoom, io);
  });

  /*----- REMOVE PLAYER FROM STATE ON DISCONNECT -----*/
  socket.on('disconnect', () => {
    const currentStatePlayers = store.getState().players[socket.currentRoom];
    let playerNickname;
    if (currentStatePlayers[socket.id] && currentStatePlayers[socket.id].nickname) {
      playerNickname = currentStatePlayers[socket.id].nickname;
    }
    io.in(socket.currentRoom).emit('new_message', `${playerNickname} has left the game!`);

    store.dispatch(removePlayer(socket.id, socket.currentRoom));
    store.dispatch(removePlayerBombs(socket.id, socket.currentRoom));
    if (currentStatePlayers) {
      const currentPlayersLength = Object.keys(currentStatePlayers).length;
      if (!currentPlayersLength) {
        store.dispatch(setWinner(null, socket.currentRoom));
      }
    }

    io.in(socket.currentRoom).emit('remove_player', socket.id);

    console.log('socket id ' + socket.id + ' has disconnected. : (');
  });
});

app.use(express.static(path.join(__dirname, '..', 'public', 'assets')));

app.use(expressStaticGzip(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

server.listen(port, () => {
  console.log(`The server is listening on port ${port}!`);
});
