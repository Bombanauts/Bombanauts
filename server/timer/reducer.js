const {
  SET_TIME,
  GET_TIME
} = require('./constants');

const initialState = require('./init-state')

//timer reducer has initial state of all of the room names, each of which is a key for an object with the start time and end time properties
const timer = (state = initialState, action) => {
  let newState = Object.assign({}, state);
  switch (action.type) {
    case GET_TIME:
      let currTime = newState[action.roomId].endTime - Date.now();
      newState[action.roomId].currTime = currTime / 1000;
      break;
    case SET_TIME:
      newState[action.roomId].endTime = action.time + 181000;
      break;
    default:
      return state;
  }

  return newState;
}

module.exports = timer;
