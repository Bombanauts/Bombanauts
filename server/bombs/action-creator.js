const {
  ADD_BOMB,
  UPDATE_BOMB_POSITIONS,
  REMOVE_PLAYER_BOMBS
} = require('./constants')

const addBomb = (newBomb) => {
  return {
    type: ADD_BOMB,
    newBomb
  }
}
const updateBombPositions = (bombs) => {
  return {
    type: UPDATE_BOMB_POSITIONS,
    bombs
  }
}

const removePlayerBombs = (id) => {
  return {
    type: REMOVE_PLAYER_BOMBS,
    id
  }
}

module.exports = {
  addBomb,
  updateBombPositions,
  removePlayerBombs
}
