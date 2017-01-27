const {
  ADD_BOMB,
  UPDATE_BOMB_POSITIONS
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

module.exports = {
  addBomb,
  updateBombPositions
}
