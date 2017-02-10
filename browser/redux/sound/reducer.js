import { MUTE, UNMUTE } from './constants';
import { unmuteSound, muteSound } from './action-creator';

const initialState = true;

export const sound = (state = initialState, action) => {
  switch (action.type) {
    case MUTE:
      return false;
    case UNMUTE:
      return true;
    default:
      return state;
  }
}
