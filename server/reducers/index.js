const { combineReducers } = require('redux')
const players = require('../players/reducer');
module.exports = combineReducers({
  players
})
