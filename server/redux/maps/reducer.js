const { GENERATE_MAP, EXPLODE_BOX } = require('./constants');
const initialState = require('./init-state');

//maps reducer has initial state of all of the room names, each of which is a key for the property of the 2D array map
const reducer = (state = initialState, action) => {
  let newState = Object.assign({}, state)
  switch (action.type) {
    case GENERATE_MAP:
      newState[action.roomId] = action.map
      break;
    case EXPLODE_BOX:
      newState[action.roomId][action.coordinates.j][action.coordinates.k] = 0;
      break;
    default:
      return state;
  }

  return newState;
}

module.exports = reducer;
