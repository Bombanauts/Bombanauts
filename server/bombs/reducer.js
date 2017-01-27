const {
  ADD_BOMB,
  UPDATE_BOMB_POSITIONS
} = require('./constants')

let initialState = {
  allBombs: {}
}

const bombs = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case ADD_BOMB:
      const newBomb = action.newBomb
      newState = Object.assign({}, state)
      newState.allBombs[newBomb.id] = {
          position: newBomb.position,
          quaternion: newBomb.quaternion
      }
      return newState;
    case UPDATE_BOMB_POSITIONS:
      newState = Object.assign({}, state)
      for (let i = 0; i < action.allBombs.length; i++) {
        const temp = action.allBombs[i];
        newState.allBombs[temp.id] = {
          position: temp.position,
          quaternion: temp.quaternion
        }
      }
      return newState;
    default:
      return state;
  }
}

module.exports = bombs;
