const { combineReducers } = require('redux');

const players = require('../players/reducer');
const bombs = require('../bombs/reducer');

module.exports = combineReducers({
  players,
  bombs
});
