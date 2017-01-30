// What are the resons behind the current file structure, as opposed to having all the action creators in one folder, all the reducers in another, etc., or perhaps even something like this: https://github.com/erikras/ducks-modular-redux?

import {
  UPDATE_BOMB_LOCATIONS,
  REMOVE_PLAYER_BOMBS
} from './constants'

export const updateBombLocations = (allBombs) => {
  return {
    type: UPDATE_BOMB_LOCATIONS,
    allBombs
  }
}

export const removePlayerBombs = (id) => {
  return {
    type: REMOVE_PLAYER_BOMBS,
    id
  }
}
