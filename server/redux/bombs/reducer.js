const { ADD_BOMB, UPDATE_BOMB_POSITIONS, REMOVE_PLAYER_BOMBS } = require('./constants');
const initialState = require('./init-state');

/*----- HAS INITIAL STATE OF ALL ROOM NAMES -----*/
/* EACH NAME CONTAINS PLAYERID KEYS W/ PROPERTIES OF PLAYER'S CURRENT BOMBS */
const bombs = (state = initialState, action) => {
  const newState = Object.assign({}, state);
  switch (action.type) {
    case ADD_BOMB:
      const newBomb = action.newBomb;
      if (!newState[action.roomId][newBomb.userId]) { newState[action.roomId][newBomb.userId] = []; }

      newState[action.roomId][newBomb.userId].push({
        id: newBomb.bombId,
        position: newBomb.position
      });

      if (newState[action.roomId][undefined]) { delete newState[action.roomId][undefined]; }
      break;
    case UPDATE_BOMB_POSITIONS:
      newState[action.roomId][action.bombs.userId] = action.bombs.bombs;
      break;
    case REMOVE_PLAYER_BOMBS:
      delete newState[action.roomId][action.id];
      return newState;
    default:
      return state;
  }

  return newState;
};

module.exports = bombs;
