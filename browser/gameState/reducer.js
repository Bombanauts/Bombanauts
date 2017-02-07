import { START_GAME } from './constants'

const initialState = {
  isPlaying: false
}

export const gameState = (state = initialState, action) => {
  let newState = Object.assign({}, state)

  switch (action.type) {
    case START_GAME:
      newState.isPlaying = true;
      break;
    default:
      return state;
  }

  return newState
}
