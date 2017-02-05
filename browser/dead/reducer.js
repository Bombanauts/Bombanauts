import { KILL_PLAYER } from './action-creator.js'

const initialState = {
  dead: false
}

export const dead = (state = initialState, action) => {
  const newState = Object.assign({}, state);
  switch (action.type) {
    case KILL_PLAYER:
      newState.dead = true;
      break;
    default:
      return state;
  }

  return newState
}
