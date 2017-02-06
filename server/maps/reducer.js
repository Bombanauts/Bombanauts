
const { GENERATE_MAP, EXPLODE_BOX } = require('./constants');
const initialState = require('../init-state');

const reducer = (state = initialState, action) => {
  let newState = Object.assign({}, state)

  switch (action.type) {
    case GENERATE_MAP:
      newState[action.roomId].mapState = action.map
      break;
    case EXPLODE_BOX:
      newState[action.roomId].mapState[action.coordinates.j][action.coordinates.k] = 0;
      break;
    default:
      return state;
  }

  return newState;
}

module.exports = reducer;
