import { START_CHAT, STOP_CHAT, RECEIVE_MESSAGE } from './constants';

export const startChat = () => ({ type: START_CHAT });

export const stopChat = () => ({ type: STOP_CHAT });

export const receiveMessage = (message) => ({
  type: RECEIVE_MESSAGE,
  message
});
