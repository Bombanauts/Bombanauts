const {
  SET_TIME,
  GET_TIME
} = require('./constants');

const initialState = require('../init-state')

const timer = (state = initialState, action) => {
  let newState = Object.assign({}, state);
  switch (action.type) {
    case GET_TIME:
      return newState[action.roomId];
    case SET_TIME:
      newState[action.roomId].startTime = action.time;
      newState[action.roomId].endTime = action.time + 181000;
      return newState;
    default:
      return newState;
  }
}

module.exports = timer;
