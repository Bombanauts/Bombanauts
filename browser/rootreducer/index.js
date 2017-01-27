import { combineReducers } from 'redux'
import { players } from '../players/reducer'
import { bombs } from '../bombs/reducer'

export default combineReducers({
  players,
  bombs
})
