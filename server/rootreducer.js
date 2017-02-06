const { combineReducers } = require('redux')

const players = require('./players/reducer')
const bombs = require('./bombs/reducer')
const map = require('./maps/reducer');
const timer = require('./timer/reducer');

//each sub reducer has a separate initial state of a list of keys of the room names, which then each has the relevant players/bombs/map/timer info, this state will then be filtered by room when it is sent to the front end so each room only gets its own relevant state info
module.exports = combineReducers({
  players,
  bombs,
  map,
  timer
})
