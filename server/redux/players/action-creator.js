const { GET_PLAYERS, UPDATE_PLAYERS, REMOVE_PLAYER, KILL_PLAYER,
  SET_NICKNAME, INCREMENT_SCORE, DECREMENT_SCORE } = require('./constants');

const getPlayers = (roomId) => ({
  type: GET_PLAYERS,
  roomId
});

const updatePlayers = (player, roomId, nickname) => ({
  type: UPDATE_PLAYERS,
  player,
  nickname,
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

const setNickname = (id, nickname, roomId) => ({
  type: SET_NICKNAME,
  id,
  nickname,
  roomId
})

const incrementScore = (id, roomId) => ({
  type: INCREMENT_SCORE,
  id,
  roomId
})

const decrementScore = (id, roomId) => ({
  type: DECREMENT_SCORE,
  id,
  roomId
})

module.exports = {
  getPlayers,
  updatePlayers,
  removePlayer,
  killPlayer,
  setNickname,
  incrementScore,
  decrementScore
}
