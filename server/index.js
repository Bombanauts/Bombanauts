const path = require('path');
const chalk = require('chalk');
const http = require('http');
const server = http.createServer();
const port = process.env.PORT || 1337;
const express = require('express');
const app = express();
const socketio = require('socket.io');
const { Maps, randomGeneration } = require('./maps/map');
const { updatePlayers, removePlayer, killPlayer, setNickname } = require('./players/action-creator');
const { addBomb, updateBombPositions, removePlayerBombs, removeBomb } = require('./bombs/action-creator')
const { updateMap, loadMap } = require('./maps/action-creator')
const { setTime } = require('./timer/action-creator')
const { setWinner } = require('./winner/action-creator')

const store = require('./store')
const worldNames = require('./world-names')
server.on('request', app);

// creates a new connection server for web sockets and integrates
// it into our HTTP server
const io = socketio(server)

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

const convertStateForFrontEnd = (state, room) => {
    return {
        players: state.players[room],
        bombs: {
            allBombs: state.bombs[room].allBombs
        },
        mapState: {
            mapState: state.mapState[room].mapState
        },
        timer: state.timer[room].timer,
        winner: state.winner[room].winner
    }
}

//  use socket server as an event emitter in order to listen for new connctions
io.on('connection', (socket) => {
    delete socket.adapter.rooms[socket.id]
    let rooms = io.sockets.adapter.rooms;
    let { currentRoomName, createdRoom } = roomName(socket, rooms)

    socket.join(currentRoomName);
    socket.currentRoom = currentRoomName;

    let currState;

    if (createdRoom) {
        console.log('new room')
        let randomMap = randomGeneration(Maps)
        store.dispatch(loadMap(randomMap, socket.currentRoom))

        let currentTime = Date.now();
        store.dispatch(setTime(currentTime, 180, socket.currentRoom))

        currState = convertStateForFrontEnd(store.getState(), socket.currentRoom);

        socket.emit('initial', currState);
    } else {
        currState = convertStateForFrontEnd(store.getState(), socket.currentRoom);
        console.log('joining a room')
        socket.emit('initial', currState);
    }

    console.log(chalk.blue('A new client has connected'));
    console.log(chalk.yellow('socket id: ', socket.id));

    socket.on('get_players', () => {
        socket.emit('get_players', store.getState().players[socket.currentRoom]);
    })

    socket.on('set_nickname', (nickname) => {
        store.dispatch(setNickname(socket.id, nickname, socket.currentRoom))
    })

    socket.on('update_world', (data) => {
        store.dispatch(updatePlayers({ id: socket.id, position: data.playerPosition, dead: data.dead, nickname: data.nickname}, socket.currentRoom));
        store.dispatch(updateBombPositions({ userId: data.playerId, bombs: data.playerBombs }, socket.currentRoom))
        let currentState = store.getState();
        // console.log(currentState.players[socket.currentRoom])
        let newState = convertStateForFrontEnd(currentState, socket.currentRoom)
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
        let currentState = store.getState();
        let currentPlayers = currentState.players[socket.currentRoom];

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

            if (currentPlayersLength > 1 && alivePlayers.length === 1) {
                store.dispatch(setWinner(alivePlayers[0].socketId, socket.currentRoom))
            }
        }
        let newState = convertStateForFrontEnd(currentState, socket.currentRoom)
        io.in(socket.currentRoom).emit('set_winner', newState.winner)
        io.in(socket.currentRoom).emit('update_world', newState)
    })

    socket.on('destroy_cube', (data) => {
        store.dispatch(updateMap(data, socket.currentRoom))
    })

    socket.on('reset_world', (data) => {
        console.log('THis is the RESET WORLD')
        setTimeout(() => {
            let newMap = randomGeneration(Maps)
            store.dispatch(setWinner(null, socket.currentRoom))
            store.dispatch(loadMap(newMap, socket.currentRoom))
            let currentTime = Date.now();
            store.dispatch(setTime(currentTime, 185, socket.currentRoom))
            io.in(socket.currentRoom).emit('set_winner', store.getState().winner[socket.currentRoom].winner)
            io.in(socket.currentRoom).emit('reset_world', {
                players: store.getState().players[socket.currentRoom],
                bombs: {
                    allBombs: []
                },
                mapState: {
                    mapState: store.getState().mapState[socket.currentRoom].mapState
                },
                timer: store.getState().timer[socket.currentRoom].timer,
                winner: null,
                dead: {
                    dead: false
                }
            })
        }, 5000);
    })

    //remove the player from the state on socket disconnect
    socket.on('disconnect', () => {
        store.dispatch(removePlayer(socket.id, socket.currentRoom))
        store.dispatch(removePlayerBombs(socket.id, socket.currentRoom))
        let currentStatePlayers = store.getState().players[socket.currentRoom].players;
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
