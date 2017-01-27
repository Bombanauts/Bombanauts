import {
  UPDATE_BOMB_LOCATIONS
} from './constants'

export const updateBombLocations = (allBombs) => {
  return {
    type: UPDATE_BOMB_LOCATIONS,
    allBombs
  }
}
