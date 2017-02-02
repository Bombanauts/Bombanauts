const { combineReducers } = require('redux')

const players = require('../players/reducer')
const bombs = require('../bombs/reducer')
const mapState = require('../maps/reducer');

module.exports = combineReducers({
  players,
  bombs,
  mapState
})
