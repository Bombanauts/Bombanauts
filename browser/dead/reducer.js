import { KILL_PLAYER } from './action-creator.js'

let initialState = false;

export const dead = (state = initialState, action) => {
  let newState = state
  switch (action.type) {
    case KILL_PLAYER:
      newState = true;
      break;
    default:
      return state;
  }

  return newState
}
