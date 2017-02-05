import { combineReducers } from 'redux'
import { players } from './players/reducer'
import { bombs } from './bombs/reducer'
import { mapState } from './maps/reducer'
import { dead } from './dead/reducer'
import timer from './timer/reducer'

export default combineReducers({
  players,
  bombs,
  mapState,
  dead,
  timer
})
