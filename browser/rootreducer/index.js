import { combineReducers } from 'redux'
import { players } from '../players/reducer'
import { bombs } from '../bombs/reducer'
import { mapState } from '../maps/reducer'

export default combineReducers({
  players,
  bombs,
  mapState
})
