import { START_CHAT, STOP_CHAT, RECEIVE_MESSAGE } from './constants';

const initialState = {
  isChatting: false,
  lastFiveMessages: []
};

export const chat = (state = initialState, action) => {
  let newState = Object.assign({}, state)
  const newChat = Array.from(newState.lastFiveMessages)

  switch (action.type) {
    case START_CHAT:
      newState.isChatting = true
      return newState;
    case STOP_CHAT:
      newState.isChatting = false
      return newState;
    case RECEIVE_MESSAGE:
      if (newChat.length > 0 && newChat.length > 3) newChat.shift()
      newChat.push(action.message)
      newState.lastFiveMessages = newChat
      return newState;
    default:
      return state;
  }
}
