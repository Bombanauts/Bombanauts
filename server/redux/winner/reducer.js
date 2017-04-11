const { SET_WINNER } = require('./constants');

const initialState = require('./init-state');

const winner = (state = initialState, action) => {
  const newState = Object.assign({}, state);
  switch (action.type) {
    case SET_WINNER:
      newState[action.roomId] = action.playerId;
      return newState;
    default:
      return newState;
  }
}

module.exports = winner
