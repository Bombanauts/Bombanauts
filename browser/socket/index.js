// we need this socket object to send messages to our server
window.socket = io(window.location.origin)

import store from '../store';
import { updatePlayerLocations } from '../players/action-creator';

import { initCannon, init, animate } from '../game/main';

socket.on('connect', function() {
  console.log('I have made a persistent two-way connection to the server!')

  socket.on('update_player_locations', function(data) {
    delete data[socket.id];
    if (data['undefined']) {
      delete data['undefined']
    }
    console.log('data: ', data)
    store.dispatch(updatePlayerLocations(data));
    console.log('state: ', store.getState());
  })

  socket.on('start', function(data) {
    initCannon();
    init();
    animate();
  })
})
