const {
  ADD_BOMB,
  UPDATE_BOMB_POSITIONS
} = require('./constants')

let initialState = {
  allBombs: []
}

//the bombs are stored in an 'allBombs' array with each of the bombs' information and the time they were created
const bombs = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case ADD_BOMB:
      newState = Object.assign({}, state)
      console.log(newState.allBombs)
      let array = newState.allBombs.concat(action.newBomb.bomb)
      newState.allBombs = array;
      return newState;
    case UPDATE_BOMB_POSITIONS:
      newState = Object.assign({}, state)
      newState.allBombs = action.bombs;
      return newState;
    default:
      return state;
  }
}

module.exports = bombs;
