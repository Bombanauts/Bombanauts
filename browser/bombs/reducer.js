import { UPDATE_BOMB_LOCATIONS } from './constants'

const initialState = {
  allBombs: []
}

//the bombs are stored in an 'allBombs' object within the state, that has keys of the user's socket ID, each with a property of an array of that user's bomb objects
export const bombs = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case UPDATE_BOMB_LOCATIONS:
      newState = Object.assign({}, state)
      newState.allBombs = action.allBombs;
      return newState;
    default:
      return state;
  }
}
