const worldNames = require('./world-names')

const roomName = (connectedSocket, roomsList) => {
  let roomsNames = Object.keys(roomsList).filter(room => {
    return room.length < 12
  });
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
}


//filter the state for the front end by only pulling the state for a specific socket room
const convertStateForFrontEnd = (state, room) => {
  return {
    players: state.players[room],
    bombs: state.bombs[room],
    map: state.map[room],
    timer: state.timer[room],
    winner: state.winner[room]
  }
}

module.exports = {
  roomName,
  convertStateForFrontEnd
}
