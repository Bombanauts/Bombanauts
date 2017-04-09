const { ADD_BOMB, UPDATE_BOMB_POSITIONS, REMOVE_PLAYER_BOMBS } = require('./constants');

const addBomb = (newBomb, roomId) => ({
  type: ADD_BOMB,
  newBomb,
  roomId
})

const updateBombPositions = (bombs, roomId) => ({
  type: UPDATE_BOMB_POSITIONS,
  bombs,
  roomId
})

const removePlayerBombs = (id, roomId) => ({
  type: REMOVE_PLAYER_BOMBS,
  id,
  roomId
})

module.exports = {
  addBomb,
  updateBombPositions,
  removePlayerBombs
}
