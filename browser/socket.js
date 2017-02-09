// we need this socket object to send messages to our server
const socket = io('/')
const THREE = require('three')
window.socket = socket
import store from './store';
window.store = store;
import { updatePlayerLocations, removePlayer } from './players/action-creator';
import { updateBombLocations, removePlayerBombs } from './bombs/action-creator'
import { loadMap } from './maps/action-creator';
import { setTime, getTime } from './timer/action-creator';
import { setWinner } from './winner/action-creator'
import { revivePlayer } from './dead/action-creator'

import { initCannon, init, animate, players, playerMeshes, world, scene, playerInstances,  resetCount, createMap, restartWorld, listener } from './game/main';
import { sprite } from './game/Player'
import { pointerChecker } from './react/App';

import { announce, removeAnnouncement } from './announcer/action-creator';
import { startChat, stopChat } from './chat/action-creator';

export let playerArr = [];
let playerToKillName = '';


socket.on('connect', function() {
  socket.on('initial', (initialData) => {
    store.dispatch(updatePlayerLocations(initialData.players));
    store.dispatch(updateBombLocations(initialData.bombs))
    store.dispatch(loadMap(initialData.map))
    store.dispatch(setTime(initialData.timer))
  })

let count = 0;
socket.on('update_world', (data) => {
  count += 1;
  playerArr = Object.keys(data.players);
  delete data.players[socket.id];
  delete data.bombs[socket.id];
  store.dispatch(updatePlayerLocations(data.players))
  store.dispatch(updateBombLocations(data.bombs))
  if (count % 30 === 0) {
    store.dispatch(setTime(data.timer))
    count = 0;
  }
})
  socket.on('set_winner', (winner) => {
    store.dispatch(setWinner(winner));
  })

  socket.on('update_bomb_positions', (data) => {
    delete data[socket.id];

    store.dispatch(updateBombLocations(data))
  })

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
        let witchSound = new THREE.PositionalAudio( listener );
        const witchAudioLoader = new THREE.AudioLoader();
        witchAudioLoader.load( 'sounds/witch.mp3', function( buffer ) {
          witchSound.setBuffer( buffer );
          witchSound.setRefDistance( 10 );
          witchSound.play()
        });
        let sound = new THREE.PositionalAudio( listener );
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load( 'sounds/die.mp3', function( buffer ) {
          sound.setBuffer( buffer );
          sound.setRefDistance( 10 );
          sound.play()
        });

        playerToKill.explode()
      } else {
        let sound = new THREE.PositionalAudio( listener );
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load( 'sounds/die.mp3', function( buffer ) {
          sound.setBuffer( buffer );
          sound.setRefDistance( 10 );
          sound.play()
        });

        playerToKill.explode()
      }
    }
  })


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
    console.log(message)
    store.dispatch(startChat())
    // store.dispatch(stopChat())
  })
})

export default socket
