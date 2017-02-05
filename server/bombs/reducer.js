const {
  ADD_BOMB,
  UPDATE_BOMB_POSITIONS,
  REMOVE_BOMB,
  REMOVE_PLAYER_BOMBS
} = require('./constants')
let initialState = require('../init-state');

//the bombs are stored in a room object within the state, that has keys of the user's socket ID, each with a property of an array of that user's bomb objects
const bombs = (state = initialState, action) => {
  let newState = Object.assign({}, state)
  console.log('in bombs reducer')
  console.log(newState)
  switch (action.type) {
    case ADD_BOMB:
      const newBomb = action.newBomb
      if (!newState[action.roomId][newBomb.userId]) newState[action.roomId][newBomb.userId] = [];
      newState[action.roomId][newBomb.userId].push({
        id: newBomb.bombId,
        position: newBomb.position
      })
      if (newState[action.roomId][undefined]) delete newState[action.roomId][undefined]
      return newState;
    case UPDATE_BOMB_POSITIONS:
      newState[action.roomId][action.bombs.userId] = action.bombs.bombs
      return newState;
    case REMOVE_PLAYER_BOMBS:
      delete newState[action.roomId][action.id]
      return newState;
    default:
      return state;
  }
}

module.exports = bombs;
