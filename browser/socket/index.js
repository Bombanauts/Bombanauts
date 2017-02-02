// we need this socket object to send messages to our server
window.socket = io(window.location.origin)

import store from '../store';
import { updatePlayerLocations, removePlayer } from '../players/action-creator';
import { updateBombLocations, removePlayerBombs } from '../bombs/action-creator'
import { loadMap } from '../maps/action-creator';

import { initCannon, init, animate, players, playerMeshes, world, scene } from '../game/main';

socket.on('connect', function() {
  socket.on('initial', (initialData) => {
    // if (initialData.players['undefined']) {
    //   delete initialData.players['undefined']
    // }
    console.log('this is INITIAL DATA', initialData)
    store.dispatch(updatePlayerLocations(initialData.players));
    store.dispatch(updateBombLocations(initialData.bombs.allBombs))
    store.dispatch(loadMap(initialData.mapState.mapState[0]))
  })

  let now = Date.now()

  socket.on('update_world', (data) => {
    delete data.players[socket.id];
    delete data.bombs.allBombs[socket.id];
    console.log('THIS WILL BE DATA', data)
    store.dispatch(updatePlayerLocations(data.players))
    store.dispatch(updateBombLocations(data.bombs.allBombs))
  })

  socket.on('update_bomb_positions', (data) => {
    delete data[socket.id];

    store.dispatch(updateBombLocations(data))
  })

  socket.on('remove_player', (id) => {
    store.dispatch(removePlayer(id))

    let playerBody = world.bodies.filter( (child) => {
      return child.name === id;
    })[0];
    let playerMesh = scene.children.filter( (child) => {
      return child.name === id;
    })[0];

    if (playerBody) world.remove(playerBody)
    if (playerMesh) scene.remove(playerMesh)
  })

  socket.on('kill_player', (data) => {
    let playerBody = world.bodies.filter( (child) => {
      return child.name === data;
    })[0];
    let playerMesh = scene.children.filter( (child) => {
      return child.name === data;
    })[0];

    if (playerBody) world.remove(playerBody)
    if (playerMesh) scene.remove(playerMesh)
  })

})
