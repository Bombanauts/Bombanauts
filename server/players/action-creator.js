const {
  GET_PLAYERS,
  UPDATE_PLAYERS,
  REMOVE_PLAYER,
  KILL_PLAYER
} = require('./constants');

const getPlayers = (roomId) => ({
  type: GET_PLAYERS,
  roomId
});

const updatePlayers = (player, roomId) => ({
  type: UPDATE_PLAYERS,
  player,
  roomId
});

const removePlayer = (id, roomId) => ({
  type: REMOVE_PLAYER,
  id,
  roomId
})

const killPlayer = (id, roomId) => ({
  type: KILL_PLAYER,
  id,
  roomId
})

module.exports = {
  getPlayers,
  updatePlayers,
  removePlayer,
  killPlayer
}
