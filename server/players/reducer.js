const {
  GET_PLAYERS,
  UPDATE_PLAYERS,
  REMOVE_PLAYER
} = require('./constants')

let initialState = {};

//the players are stored in the state each with a key of their socket id, with a property of an object containing their x, y, z coordinates
const players = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET_PLAYERS:
      return state.players;
    case UPDATE_PLAYERS:
      newState = Object.assign({}, state);
      newState[action.player.id] = action.player.position;
      return newState;
    case REMOVE_PLAYER:
      delete state[action.id]
      newState = Object.assign({}, state);
      return newState;
    default:
      return state;
  }
}

module.exports = players;
