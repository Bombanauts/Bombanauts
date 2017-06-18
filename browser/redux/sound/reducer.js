import { MUTE, UNMUTE } from './constants';

export const sound = (state = true, action) => {
  switch (action.type) {
    case MUTE:
      return false;
    case UNMUTE:
      return true;
    default:
      return state;
  }
}

export const getIsMuted = (state) => state.sound;
