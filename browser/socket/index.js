// we need this socket object to send messages to our server
window.socket = io(window.location.origin)

import store from '../store';
import { updatePlayerLocations, removePlayer } from '../players/action-creator';
import { updateBombLocations } from '../bombs/action-creator'

import { initCannon, init, animate } from '../game/main';

socket.on('connect', function() {

  socket.on('update_player_positions', (data) => {
    delete data[socket.id];
    if (data['undefined']) {
      delete data['undefined']
    }
    store.dispatch(updatePlayerLocations(data.players));
  })

  socket.on('update_bomb_positions', (data) => {
    if (data['undefined']) {
      delete data['undefined']
    }
    // console.log('data: ', data)
    store.dispatch(updateBombLocations(data.allBombs))
  })

  socket.on('remove_player', (data) => {
    store.dispatch(removePlayer(data.id))
  })
})

