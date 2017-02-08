const worldNames = require('./world-names');
const store = require('./store');
const { randomGeneration } = require('./maps/map');

const { loadMap } = require('./maps/action-creator')
const { setTime, getTime } = require('./timer/action-creator')
const { setWinner } = require('./winner/action-creator')

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
        timer: state.timer[room].currTime,
        winner: state.winner[room]
    }
}

//RESET WORLD WHEN REQIRED
const resetWorld = (maps, room, io) => {
    let newMap = randomGeneration(maps)
    let currentTime = Date.now();
    store.dispatch(loadMap(newMap, room))
    store.dispatch(setTime(currentTime, room));
    store.dispatch(getTime(room))
    let state = store.getState()
    io.in(room).emit('set_winner', state.winner[room])
    io.in(room).emit('reset_world', {
        players: state.players[room],
        bombs: {},
        map: state.map[room],
        timer: state.timer[room].currTime,
        dead: false
    })
    store.dispatch(setWinner(null, room))
}

module.exports = {
    roomName,
    convertStateForFrontEnd,
    resetWorld
}
