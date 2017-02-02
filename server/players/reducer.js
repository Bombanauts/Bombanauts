const {
  GET_PLAYERS,
  UPDATE_PLAYERS,
  REMOVE_PLAYER,
  KILL_PLAYER
} = require('./constants')

let initialState = {};

//the players are stored in the state each with a key of their socket id, with a property of an object containing their x, y, z coordinates
const players = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET_PLAYERS:
      return state;
    case UPDATE_PLAYERS:
      newState = Object.assign({}, state);
      if (action.player.id) {
        newState[action.player.id] = {
          x: action.player.position.x,
          y: action.player.position.y,
          z: action.player.position.z,
          dead: action.player.dead
        }
      }
      return newState;
    case REMOVE_PLAYER:
      newState = Object.assign({}, state);
      delete newState[action.id]
      return newState;
    case KILL_PLAYER:
      newState = Object.assign({}, state)
      if (newState[action.id]) newState[action.id].dead = true;
      return newState;
    default:
      return state;
  }
}

module.exports = players;
