import {
  SET_TIME,
  GET_TIME
} from './constants';

const initialState = 180;


const timer = (state = initialState, action) => {
  let newState = state;
  switch (action.type) {
    case SET_TIME:
      newState = action.time;
      return newState;
    default:
      return newState;
  }
}

export default timer
