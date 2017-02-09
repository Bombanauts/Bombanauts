import { START_CHAT, STOP_CHAT, RECEIVE_MESSAGE, SHOW_CHAT } from './constants';

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

export const receiveMessage = (message) => {
  return {
    type: RECEIVE_MESSAGE,
    message
  }
}
