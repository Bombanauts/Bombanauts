const {
  GET_PLAYERS,
  UPDATE_PLAYERS,
  REMOVE_PLAYER,
  KILL_PLAYER
} = require('./constants');

const getPlayers = () => ({
  type: GET_PLAYERS
});

const updatePlayers = (player) => ({
  type: UPDATE_PLAYERS,
  player
});

const removePlayer = (id) => ({
  type: REMOVE_PLAYER,
  id
})

const killPlayer = (id) => ({
  type: KILL_PLAYER,
  id
})

module.exports = {
  getPlayers,
  updatePlayers,
  removePlayer,
  killPlayer
}
