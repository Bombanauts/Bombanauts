import { UPDATE_BOMB_LOCATIONS } from './constants'

const initialState = {
  allBombs: {}
}

export const bombs = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case UPDATE_BOMB_LOCATIONS:
      newState = Object.assign({}, state);
      newState.allBombs = action.allBombs;
      return newState;
    default:
      return state;
  }
}
