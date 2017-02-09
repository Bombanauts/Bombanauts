// WE NEED THIS SOCKET OBJ TO SEND REQUESTS TO OUR SERVER
const socket = io('/')

//THREE.JS
import * as THREE from 'three';

//REDUX STORE
import store from './redux/store';

window.store = store;

//PLAYERS
import {
    updatePlayerLocations,
    removePlayer
} from './redux/players/action-creator';

//BOMBS
import { updateBombLocations } from './redux/bombs/action-creator';

// CHAT
import { receiveMessage } from './redux/chat/action-creator';

//MAPS
import { loadMap } from './redux/maps/action-creator';

//TIMER
import { setTime } from './redux/timer/action-creator';

//WINNER
import { setWinner } from './redux/winner/action-creator';

//DEAD
import { revivePlayer } from './redux/dead/action-creator';

//OWNINFO
import {
    setName,
    setScore
} from './redux/ownInfo/action-creator';

//ANNOUNCER
import {
    announce,
    removeAnnouncement
} from './redux/announcer/action-creator';

//THREE.JS FROM MAIN
import {
    world,
    scene,
    playerInstances,
    restartWorld,
    listener
} from './game/main';

//PLAYER SPRITE
import { sprite } from './game/Player';


export let playerArr = [];
let count = 0;

//MAKING CONNECTION TO THE SERVER
socket.on('connect', function() {
    socket.on('initial', (initialData) => {
        store.dispatch(updatePlayerLocations(initialData.players));
        store.dispatch(updateBombLocations(initialData.bombs))
        store.dispatch(loadMap(initialData.map))
        store.dispatch(setTime(initialData.timer))
    })

    //UPDATING WORLD 60 TIMES PER SECOND
    socket.on('update_world', (data) => {
        count += 1;
        playerArr = Object.keys(data.players);
        if (data.players[socket.id]) {
            store.dispatch(setScore(data.players[socket.id].score));
            store.dispatch(setName(data.players[socket.id].nickname));
        }
        delete data.players[socket.id];
        delete data.bombs[socket.id];
        store.dispatch(updatePlayerLocations(data.players))
        store.dispatch(updateBombLocations(data.bombs))
        if (count % 30 === 0) {
            store.dispatch(setTime(data.timer))
            count = 0;
        }
    })

    //SETTING WINNER
    socket.on('set_winner', (winner) => {
        store.dispatch(setWinner(winner));
    })

    //TRACKING POSITIONS OF THE BOMBS
    socket.on('update_bomb_positions', (data) => {
        delete data[socket.id];

        store.dispatch(updateBombLocations(data))
    })

    //KILLING PLAYER, TRACKING WHO KILLED WHO
    socket.on('kill_player', (data) => {
        store.dispatch(announce(data.killerNickname, data.victimNickname))
        setTimeout(() => {
            store.dispatch(removeAnnouncement())
        }, 3000)
        let playerToKill = playerInstances.filter(player => {
            return player.socketId === data.id;
        })[0]
        if (playerToKill) {
            let currentStateAnnouncement = store.getState().announcement;
            if (currentStateAnnouncement.killer.nickname === currentStateAnnouncement.victim.nickname) {
                let witchSound = new THREE.PositionalAudio(listener);
                const witchAudioLoader = new THREE.AudioLoader();
                witchAudioLoader.load('sounds/witch.mp3', function(buffer) {
                    witchSound.setBuffer(buffer);
                    witchSound.setRefDistance(10);
                    witchSound.play()
                });
                let sound = new THREE.PositionalAudio(listener);
                const audioLoader = new THREE.AudioLoader();
                audioLoader.load('sounds/die.mp3', function(buffer) {
                    sound.setBuffer(buffer);
                    sound.setRefDistance(10);
                    sound.play()
                });

                playerToKill.explode()
            } else {
                let sound = new THREE.PositionalAudio(listener);
                const audioLoader = new THREE.AudioLoader();
                audioLoader.load('sounds/die.mp3', function(buffer) {
                    sound.setBuffer(buffer);
                    sound.setRefDistance(10);
                    sound.play()
                });

                playerToKill.explode()
            }
        }
    })

    //RESTARTING WORLD WHEN TIMER REACH 0 OR WHEN ONE PLAYER LEFT
    socket.on('reset_world', (data) => {
        setTimeout(() => {
            store.dispatch(loadMap(data.map));
            store.dispatch(updatePlayerLocations(data.players));
            store.dispatch(updateBombLocations(data.bombs));
            store.dispatch(revivePlayer());
            store.dispatch(setTime(data.timer))
            restartWorld();
            store.dispatch(setWinner(null))
        }, 5000)
    })

    //REMOVING PLAYER'S PHISICAL BODY AND VISUAL BODY
    socket.on('remove_player', (id) => {
        store.dispatch(removePlayer(id))
        let playerBody = world.bodies.filter((child) => {
            return child.name === id;
        })[0];
        let playerMesh = scene.children.filter((child) => {
            return child.name === id;
        })[0];

        if (playerBody) world.remove(playerBody)
        if (playerMesh) {
            scene.remove(playerMesh)
            scene.remove(sprite)
            world.remove(sprite)
        }
    })

  socket.on('new_message', (message) => {
    store.dispatch(receiveMessage(message))
  })

})

export default socket
