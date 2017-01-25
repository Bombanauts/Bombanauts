const {
  GET_PLAYERS,
  ADD_PLAYER
} = require('./constants');


let initialState = {};

const players = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET_PLAYERS:
      return state.players;
    case ADD_PLAYER:
      newState = Object.assign({}, state);
      newState[action.player.id] = action.player.position;
      return newState;
    default:
      return state;
  }
}

module.exports = players;
