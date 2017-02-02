const Maps = require('./map');
const { GENERATE_MAP, EXPLODE_BOX } = require('./constants');


const initialState = {
  mapState: Maps
}

const reducer = (state = initialState, action) => {
  let newState = Object.assign({}, state)

  switch (action.type) {
    case GENERATE_MAP:
      newState.mapState = action.map
      break;
    case EXPLODE_BOX:
      newState.mapState[0][action.coordinates.j][action.coordinates.k] = 0;
      break;
    default:
      return state;
  }

  return newState;
}

module.exports = reducer;
