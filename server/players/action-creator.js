const {
  GET_PLAYERS,
  ADD_PLAYER
} = require('./constants');

const getPlayers = () => ({
  type: GET_PLAYERS,
  players
});

const addPlayer = (player) => ({
  type: ADD_PLAYER,
  player
});

module.exports = {
  getPlayers,
  addPlayer
}
