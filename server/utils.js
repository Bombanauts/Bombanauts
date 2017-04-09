const worldNames = require('./world-names');
const store = require('./redux/store');
const { randomGeneration } = require('./redux/maps/map');

const { loadMap } = require('./redux/maps/action-creator');
const { setTime, getTime } = require('./redux/timer/action-creator');
const { setWinner } = require('./redux/winner/action-creator');

/*----- GET ROOM NAME -----*/
const roomName = (connectedSocket, roomsList) => {
  const roomsNames = Object.keys(roomsList).filter(room => room.length < 12);

  let currentRoomName;
  let createdRoom = false;
  if (!roomsNames.length) {
    return { currentRoomName: worldNames[0], createdRoom: true };
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
  return { currentRoomName, createdRoom };
};

/* FILTER STATE FOR FRONT END BY ONLY PULLING STATE FOR SPECIFIC ROOM */
const convertStateForFrontEnd = (state, room) => ({
  players: state.players[room],
  bombs: state.bombs[room],
  map: state.map[room],
  timer: state.timer[room].currTime,
  winner: state.winner[room]
});

// RESET WORLD WHEN REQUIRED
const resetWorld = (maps, room, io) => {
  const newMap = randomGeneration(maps);
  const currentTime = Date.now();
  store.dispatch(loadMap(newMap, room));
  store.dispatch(setTime(currentTime, room));
  store.dispatch(getTime(room));
  const state = store.getState();
  io.in(room).emit('set_winner', state.winner[room]);
  io.in(room).emit('reset_world', {
    players: state.players[room],
    bombs: {},
    map: state.map[room],
    timer: state.timer[room].currTime,
    dead: false
  });
  store.dispatch(setWinner(null, room));
};

module.exports = { roomName, convertStateForFrontEnd, resetWorld };
