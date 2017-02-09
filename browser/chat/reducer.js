import { START_CHAT, STOP_CHAT } from './constants';

const initialState = false;

export const isChatting = (state = initialState, action) => {
  switch(action.type) {
    case START_CHAT:
      return true;
    case STOP_CHAT:
      return false;
    default:
      return state;
  }
}
