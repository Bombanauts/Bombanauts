import { START_GAME } from './constants';

export const isPlaying = (state = false, action) => {
  switch (action.type) {
    case START_GAME:
      return true;
    default:
      return state;
  }
};
