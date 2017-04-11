const { SET_TIME, GET_TIME } = require('./constants');

const initialState = require('./init-state')

/*----- INITIAL STATE OF ALL ROOM NAMES -----*/
/*----- CONTAINS START & END TIME PROPERTIES -----*/
const timer = (state = initialState, action) => {
  let newState = Object.assign({}, state);
  switch (action.type) {
    case GET_TIME:
      let currTime = newState[action.roomId].endTime - Date.now();
      newState[action.roomId].currTime = currTime / 1000;
      break;
    case SET_TIME:
      newState[action.roomId].endTime = action.time + 180300;
      break;
    default:
      return state;
  }

  return newState;
}

module.exports = timer;
