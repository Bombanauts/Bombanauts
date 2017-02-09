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
