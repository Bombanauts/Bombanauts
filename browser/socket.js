// we need this socket object to send messages to our server
const socket = io('/')
const THREE = require('three')

import store from './store';
window.store = store;
import { updatePlayerLocations, removePlayer } from './players/action-creator';
import { updateBombLocations, removePlayerBombs } from './bombs/action-creator'
import { loadMap } from './maps/action-creator';
import { setTime, getTime } from './timer/action-creator';
import { setWinner } from './winner/action-creator'

import { initCannon, init, animate, players, playerMeshes, world, scene, playerInstances,  resetCount, createMap, restartWorld, listener } from './game/main';

import { pointerChecker } from './react/App';

export let playerArr = [];
let playerToKillName = '';


socket.on('connect', function() {
  socket.on('initial', (initialData) => {
    store.dispatch(updatePlayerLocations(initialData.players));
    store.dispatch(updateBombLocations(initialData.bombs))
    store.dispatch(loadMap(initialData.map))
    store.dispatch(setTime(initialData.timer.startTime, initialData.timer.endTime))
  })

socket.on('update_world', (data) => {
  playerArr = Object.keys(data.players);
  delete data.players[socket.id];
  delete data.bombs[socket.id];
  store.dispatch(updatePlayerLocations(data.players))
  store.dispatch(updateBombLocations(data.bombs))
  store.dispatch(setTime(data.timer.startTime, data.timer.endTime))
})
  socket.on('set_winner', (winner) => {
    store.dispatch(setWinner(winner));
  })

  socket.on('update_bomb_positions', (data) => {
    delete data[socket.id];

    store.dispatch(updateBombLocations(data))
  })

  socket.on('kill_player', (data) => {
    let playerToKill = playerInstances.filter(player => {
      return player.socketId === data;
    })[0]
    if (playerToKill) {
      let sound = new THREE.PositionalAudio( listener );
      const audioLoader = new THREE.AudioLoader();
      audioLoader.load( 'sounds/die.mp3', function( buffer ) {
        sound.setBuffer( buffer );
        sound.setRefDistance( 10 );
        sound.play()
      });

      playerToKill.explode()
    }
  })


  socket.on('reset_world', (data) => {
    store.dispatch(loadMap(data.map));
    store.dispatch(updatePlayerLocations(data.players));
    store.dispatch(updateBombLocations(data.bombs));

    restartWorld();
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
    if (playerMesh) scene.remove(playerMesh)
  })
})

export default socket