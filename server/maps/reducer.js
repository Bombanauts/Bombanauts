const Maps = require('./map');
const { GENERATE_MAP } = require('./constants');


const initialState = {
  mapState: Maps
}

const reducer = (state = initialState, action) => {
  let newState = Object.assign({}, state)

  switch (action.type) {
    case GENERATE_MAP:
      newState.mapState = action.map
      break;
    default:
      return state;
  }

  return newState;
}

module.exports = reducer;
