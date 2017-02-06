import {
  SET_TIME,
  GET_TIME
} from './constants';

const initialState = {
  startTime: '',
  endTime: ''
};


const timer = (state = initialState, action) => {
  let newState = Object.assign({}, state);
  switch (action.type) {
    case GET_TIME:
      return newState.timer;  // Is this an accident waiting to happen since you're returning `timer`? Is there a comment or something making sure devs know this action type always returns the `timer`?
    case SET_TIME:
      newState.startTime = action.time;
      newState.endTime = action.timeLimit;
      return newState;
    default:
      return newState;
  }
}

export default timer
