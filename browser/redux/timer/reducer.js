import { SET_TIME } from './constants';

const timer = (state = 180, action) => {
  switch (action.type) {
    case SET_TIME:
      return action.time;
    default:
      return state;
  }
}

export default timer;

export const getCurrentTime = (state) => state.timer;
