import * as THREE from 'three';
import { world, scene, playerInstances, restartWorld, listener } from './game/main';
import { sprite } from './game/Player';
import store from './redux/store';
import { updatePlayerLocations, removePlayer } from './redux/players/action-creator';
import { setName, setScore } from './redux/ownInfo/action-creator';
import { announce, removeAnnouncement } from './redux/announcer/action-creator';
import { updateBombLocations } from './redux/bombs/action-creator';
import { receiveMessage } from './redux/chat/action-creator';
import { loadMap } from './redux/maps/action-creator';
import { setTime } from './redux/timer/action-creator';
import { setWinner } from './redux/winner/action-creator';
import { revivePlayer } from './redux/dead/action-creator';

const socket = io('/');
export let playerArr = [];
let count = 0;

/*----- MAKE CONNECTION TO THE SERVER -----*/
socket.on('connect', () => {
  socket.on('initial', (initialData) => {
    store.dispatch(updatePlayerLocations(initialData.players));
    store.dispatch(updateBombLocations(initialData.bombs));
    store.dispatch(loadMap(initialData.map));
    store.dispatch(setTime(initialData.timer));
  });

  /*----- UPDATES WORLD 60 TIMES/SEC -----*/
  socket.on('update_world', (data) => {
    count += 1;
    playerArr = Object.keys(data.players);
    if (data.players[socket.id]) {
      store.dispatch(setScore(data.players[socket.id].score));
      store.dispatch(setName(data.players[socket.id].nickname));
    }
    delete data.players[socket.id];
    delete data.bombs[socket.id];
    store.dispatch(updatePlayerLocations(data.players));
    store.dispatch(updateBombLocations(data.bombs));
    if (count % 30 === 0) {
      store.dispatch(setTime(data.timer));
      count = 0;
    }
  });

  /*----- SETS WINNER -----*/
  socket.on('set_winner', (winner) => {
    store.dispatch(setWinner(winner));
  });

  /*----- TRACKING POSITIONS OF THE BOMBS -----*/
  socket.on('update_bomb_positions', (data) => {
    delete data[socket.id];
    store.dispatch(updateBombLocations(data));
  });

  /*----- KILLING PLAYER, TRACKING WHO KILLED WHO -----*/
  socket.on('kill_player', (data) => {
    store.dispatch(announce(data.killerNickname, data.victimNickname));
    setTimeout(() => {
      store.dispatch(removeAnnouncement());
    }, 3000);
    const playerToKill = playerInstances.filter((player) => player.socketId === data.id)[0];

    if (playerToKill) {
      const state = store.getState();
      const currentStateAnnouncement = state.announcement;
      const sound = state.sound;
      if (sound) {
        const positionalAudio = new THREE.PositionalAudio(listener);
        const audioLoader = new THREE.AudioLoader();

        if (currentStateAnnouncement.killer.nickname === currentStateAnnouncement.victim.nickname) {
          audioLoader.load('sounds/witch.mp3', (buffer) => {
            positionalAudio.setBuffer(buffer);
            positionalAudio.setRefDistance(10);
            positionalAudio.play();
          });
        }

        audioLoader.load('sounds/die.mp3', (buffer) => {
          positionalAudio.setBuffer(buffer);
          positionalAudio.setRefDistance(10);
          positionalAudio.play();
        });
      }

      playerToKill.explode();
    }
  });

  /* RESTARTS WORLD WHEN TIMER HITS 0 OR WHEN ONE PLAYER LEFT */
  socket.on('reset_world', (data) => {
    setTimeout(() => {
      store.dispatch(loadMap(data.map));
      store.dispatch(updatePlayerLocations(data.players));
      store.dispatch(updateBombLocations(data.bombs));
      store.dispatch(revivePlayer());
      store.dispatch(setTime(data.timer));
      restartWorld();
      store.dispatch(setWinner(null));
    }, 5000);
  });

  /*----- REMOVES PLAYER'S PHISICAL BODY & VISUAL BODY -----*/
  socket.on('remove_player', (id) => {
    store.dispatch(removePlayer(id));
    const playerBody = world.bodies.filter((child) => child.name === id)[0];
    const playerMesh = scene.children.filter((child) => child.name === id)[0];

    if (playerBody) { world.remove(playerBody); }
    if (playerMesh) {
      scene.remove(playerMesh);
      scene.remove(sprite);
      world.remove(sprite);
    }
  });

  socket.on('new_message', (message) => {
    store.dispatch(receiveMessage(message));
  });
});

export default socket;
