import { START_CHAT, STOP_CHAT, RECEIVE_MESSAGE } from './constants';

const initialState = {
  isChatting: false,
  lastFiveMessages: []
};

export const chat = (state = initialState, action) => {
  switch (action.type) {
    case START_CHAT:
      return Object.assign({}, state, { isChatting: true });
    case STOP_CHAT:
      return Object.assign({}, state, { isChatting: false });
    case RECEIVE_MESSAGE:
      if (state.lastFiveMessages.length > 0 && state.lastFiveMessages.length > 4) {
        return Object.assign({}, state, {
          lastFiveMessages: [...state.lastFiveMessages.slice(1), action.message]
        });
      }
      return Object.assign({}, state, {
        lastFiveMessages: [...state.lastFiveMessages, action.message]
      });
    default:
      return state;
  }
};

export const getIsChatting = (state) => state.chat.isChatting;

export const getLastFiveMessages = (state) => state.chat.lastFiveMessages;
