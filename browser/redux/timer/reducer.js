import { SET_TIME } from './constants';

const initialState = 180;

const timer = (state = 180, action) => {
  switch (action.type) {
    case SET_TIME:
      return action.time;
    default:
      return state;
  }

  return state;
}

export default timer;

export const getCurrentTime = (state) => state.timer;
