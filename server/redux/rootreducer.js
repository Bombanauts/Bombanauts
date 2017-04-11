const { combineReducers } = require('redux');

const players = require('./players/reducer');
const bombs = require('./bombs/reducer');
const map = require('./maps/reducer');
const timer = require('./timer/reducer');
const winner = require('./winner/reducer');

/* EACH SUB REDUCER HAS OWN INITIAL STATE W/ RELEVANT INFO & FILTERED BY ROOM */
module.exports = combineReducers({
  players,
  bombs,
  map,
  timer,
  winner
});
