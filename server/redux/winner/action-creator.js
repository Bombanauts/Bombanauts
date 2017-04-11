const { SET_WINNER } = require('./constants');

const setWinner = (playerId, roomId) => ({
  type: SET_WINNER,
  playerId,
  roomId
})

module.exports = { setWinner };
