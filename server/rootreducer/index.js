const { combineReducers } = require('redux')

const players = require('../players/reducer')
const bombs = require('../bombs/reducer')
const map = require('../maps/reducer');
const timer = require('../timer/reducer');

module.exports = combineReducers({
  players,
  bombs,
  map,
  timer
})
