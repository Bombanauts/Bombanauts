import { UPDATE_BOMB_LOCATIONS, REMOVE_PLAYER_BOMBS } from './constants'

const initialState = {
}

//the bombs are stored in an 'allBombs' object within the state, that has keys of the user's socket ID, each with a property of an array of that user's bomb objects
export const bombs = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case UPDATE_BOMB_LOCATIONS:
      newState = Object.assign({}, state);
      for (let key in action.allBombs) {
        newState[key] = action.allBombs[key]
      }
      return newState;
    case REMOVE_PLAYER_BOMBS:
      newState = Object.assign({}, state)
      delete newState[action.id]
      return newState;
    default:
      return state;
  }
}
