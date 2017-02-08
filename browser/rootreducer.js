import { combineReducers } from 'redux'
import { players } from './players/reducer'
import { bombs } from './bombs/reducer'
import { map } from './maps/reducer'
import { dead } from './dead/reducer'
import timer from './timer/reducer'
import winner from './winner/reducer'
import { isPlaying } from './gameState/reducer'
import { announcement } from './announcer/reducer'

export default combineReducers({
  players,
  bombs,
  map,
  dead,
  timer,
  winner,
  isPlaying,
  announcement
})
