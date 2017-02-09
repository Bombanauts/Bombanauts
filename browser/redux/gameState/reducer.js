import { START_GAME } from './constants'

const initialState = false

export const isPlaying = (state = initialState, action) => {
  let newState = state

  switch (action.type) {
    case START_GAME:
      newState = true;
      break;
    default:
      return state;
  }

  return newState
}
