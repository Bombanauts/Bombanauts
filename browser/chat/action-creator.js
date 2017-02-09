import { START_CHAT, STOP_CHAT } from './constants';

export const startChat = () => {
  return {
    type: START_CHAT
  }
}

export const stopChat = () => {
  return {
    type: STOP_CHAT
  }
}
