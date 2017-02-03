const {
  GET_PLAYERS,
  UPDATE_PLAYERS,
  REMOVE_PLAYER,
  KILL_PLAYER
} = require('./constants')

const initialState = require('./init-state');

//the players are stored in the state each with a key of their socket id, with a property of an object containing their x, y, z coordinates
const players = (state = initialState, action) => {
  let newState = Object.assign({}, state);
  switch (action.type) {
    case GET_PLAYERS:
      return newState[action.roomId];
    case UPDATE_PLAYERS:
      if (action.player.id) {
        newState[action.roomId][action.player.id] = {
          x: action.player.position.x,
          y: action.player.position.y,
          z: action.player.position.z,
          dead: action.player.dead
        }
      }
      return newState;
    case REMOVE_PLAYER:
      delete newState[action.roomId][action.id]
      return newState;
    case KILL_PLAYER:
      if (newState[action.roomId][action.id]) newState[action.roomId][action.id].dead = true;
      return newState;
    default:
      return newState;
  }
}

module.exports = players;
