// we need this socket object to send messages to our server
window.socket = io(window.location.origin)

import store from '../store';
import {getPlayersPosition} from '../players/action-creator';

import { initCannon, init, animate } from '../game/main';

socket.on('connect', function() {
  console.log('I have made a persistent two-way connection to the server!')

  // socket.on('move', function() {
  //   socket.emit('move', {})
  // })

  socket.on('update_players_position', function(data) {
    delete data[socket.id];
    if (data['undefined']) {
      delete data['undefined']
    }
    store.dispatch(getPlayersPosition(data));
    // console.log(store.getState());
  })

})
