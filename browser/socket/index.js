// we need this socket object to send messages to our server
window.socket = io(window.location.origin)

import store from '../store';
import { updatePlayerLocations, removePlayer } from '../players/action-creator';

import { initCannon, init, animate } from '../game/main';

socket.on('connect', function() {
  console.log('I have made a persistent two-way connection to the server!')


  socket.on('update_player_locations', (data) => {
    delete data[socket.id];
    if (data['undefined']) {
      delete data['undefined']
    }
    store.dispatch(updatePlayerLocations(data));
  })

  socket.on('remove_player', (data) => {
    store.dispatch(removePlayer(data.id))
  })

})
