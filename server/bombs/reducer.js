const {
  ADD_BOMB,
  UPDATE_BOMB_POSITIONS
} = require('./constants')

let initialState = {
  allBombs: {}
}

//the bombs are stored in an 'allBombs' object within the state, that has keys of the user's socket ID, each with a property of an array of that user's bomb objects
const bombs = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case ADD_BOMB:
      const newBomb = action.newBomb
      newState = Object.assign({}, state)
      if (!newState.allBombs[newBomb.userId]) newState.allBombs[newBomb.userId] = [];
      newState.allBombs[newBomb.userId].push({
          id: newBomb.bomb.id,
          position: newBomb.bomb.position
      })
      return newState;
    case UPDATE_BOMB_POSITIONS:
      newState = Object.assign({}, state)
      newState.allBombs[action.bombs.userId] = action.bombs.bombs
      return newState;
    default:
      return state;
  }
}

module.exports = bombs;
