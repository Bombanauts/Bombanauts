import { KILL_PLAYER } from './action-creator.js'

const initialState = {
  dead: false
}

export const dead = (state = initialState, action) => {
  const newState = Object.assign({}, state);
  switch (action.type) {
    case KILL_PLAYER:
      newState.dead = true;
      break;  // If you only have one default state maybe consider returning `newState` here?
    default:
      return state;
  }

  return newState  // Unless you like the consistency of having it here
}
