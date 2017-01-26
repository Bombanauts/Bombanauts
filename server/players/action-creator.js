const {
  GET_PLAYERS,
  UPDATE_PLAYERS,
  REMOVE_PLAYER
} = require('./constants');

const getPlayers = () => ({
  type: GET_PLAYERS,
  players
});

const updatePlayers = (player) => ({
  type: UPDATE_PLAYERS,
  player
});

const removePlayer = (id) => ({
  type: REMOVE_PLAYER,
  id
})

module.exports = {
  getPlayers,
  updatePlayers,
  removePlayer
}
