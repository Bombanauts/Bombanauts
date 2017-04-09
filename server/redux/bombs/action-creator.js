const { ADD_BOMB, UPDATE_BOMB_POSITIONS, REMOVE_PLAYER_BOMBS } = require('./constants');

const addBomb = (newBomb, roomId) => {
  return {
    type: ADD_BOMB,
    newBomb,
    roomId
  }
}

const updateBombPositions = (bombs, roomId) => {
  return {
    type: UPDATE_BOMB_POSITIONS,
    bombs,
    roomId
  }
}

const removePlayerBombs = (id, roomId) => {
  return {
    type: REMOVE_PLAYER_BOMBS,
    id,
    roomId
  }
}

module.exports = {
  addBomb,
  updateBombPositions,
  removePlayerBombs
}
