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
const updateBombPositions = (allBombs) => {
  return {
    type: UPDATE_BOMB_POSITIONS,
    allBombs
  }
}

module.exports = {
  addBomb,
  updateBombPositions
}
