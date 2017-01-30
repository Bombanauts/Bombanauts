const {
  ADD_BOMB,
  UPDATE_BOMB_POSITIONS,
  REMOVE_PLAYER_BOMBS
} = require('./constants');

let initialState = {
  allBombs: {}
};

//the bombs are stored in an 'allBombs' object within the state, that has keys of the user's socket ID, each with a property of an array of that user's bomb objects
const bombs = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case ADD_BOMB:
      newState = Object.assign({}, state)  // Keeping all newState assignments at the top may make it easier to ensure it's always done
      const newBomb = action.newBomb
      if (!newState.allBombs[newBomb.userId]) newState.allBombs[newBomb.userId] = [];
      newState.allBombs[newBomb.userId].push({
          position: newBomb.position
      });
      return newState;
    case UPDATE_BOMB_POSITIONS:
      newState = Object.assign({}, state)
      newState.allBombs[action.bombs.userId] = action.bombs.bombs
      return newState;
    case REMOVE_PLAYER_BOMBS:
      newState = Object.assign({}, state)
      delete newState.allBombs[action.id]
      return newState;
    default:
      return state;
  }
}

module.exports = bombs;
