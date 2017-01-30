// we need this socket object to send messages to our server
window.socket = io(window.location.origin)

import {scene} from '../game/main';
import store from '../store';
import { updatePlayerLocations, removePlayer } from '../players/action-creator';
import { updateBombLocations, removePlayerBombs } from '../bombs/action-creator'

import { initCannon, init, animate,players, playerMeshes, world } from '../game/main';

socket.on('connect', function() {

  socket.on('initial', (initialData) => {
    if (initialData['undefined']) {  // What do these initial if statements do? If necessary, can they be DRYed up?
      delete initialData['undefined']
    }
    store.dispatch(updatePlayerLocations(initialData));
  })

  socket.on('update_player_locations', (data) => {
    delete data[socket.id];
    if (data['undefined']) {
      delete data['undefined']
    }
    store.dispatch(updatePlayerLocations(data));
  })




  socket.on('update_bomb_positions', (data) => {
    delete data[socket.id];
    if (data['undefined']) {
      delete data['undefined']
    }
    store.dispatch(updateBombLocations(data))
  })


  socket.on('remove_player', (data) => {

    store.dispatch(removePlayer(data))
    scene.remove(scene.getObjectByName(data))
    world.removeBody(world.getObjectByName(data))
    store.dispatch(removePlayerBombs(data))
  })

})
