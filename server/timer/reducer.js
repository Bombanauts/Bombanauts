const {
  SET_TIME,
  GET_TIME
} = require('./constants');

const initialState = require('../init-state')

const timer = (state = initialState, action) => {
  let newState = Object.assign({}, state);
  switch (action.type) {
    case GET_TIME:
      return newState[action.roomId].timer;
    case SET_TIME:
      newState[action.roomId].timer.startTime = action.time;
      newState[action.roomId].timer.endTime = 180000;
      return newState;
    default:
      return newState;
  }
}

module.exports = timer;
