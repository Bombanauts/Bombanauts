const { GET_PLAYERS, UPDATE_PLAYERS, REMOVE_PLAYER,
    KILL_PLAYER, SET_NICKNAME, INCREMENT_SCORE, DECREMENT_SCORE } = require('./constants');
const initialState = require('./init-state');

/*----- INITIAL STATE HAS ALL ROOM NAMES -----*/
/*----- CONTAINS PLAYERIDS W/ POSITIONS & DEATH STATUS -----*/
const players = (state = initialState, action) => {
  let newState = Object.assign({}, state);
  switch (action.type) {
    case GET_PLAYERS:
      return newState[action.roomId];
    case UPDATE_PLAYERS:
      if (action.player.id) {
        let currentPlayer = newState[action.roomId][action.player.id];
        if (!currentPlayer) {
          newState[action.roomId][action.player.id] = {
            x: action.player.position.x,
            y: action.player.position.y,
            z: action.player.position.z,
            dead: action.player.dead,
            nickname: '',
            score: 0
          }
        } else {
          let { x, y, z } = action.player.position;
          currentPlayer.x = x;
          currentPlayer.y = y;
          currentPlayer.z = z;
          currentPlayer.dead = action.player.dead;
        }
      }
      return newState;
    case REMOVE_PLAYER:
      delete newState[action.roomId][action.id];
      return newState;
    case KILL_PLAYER:
      if (newState[action.roomId][action.id]) newState[action.roomId][action.id].dead = true;
      return newState;
    case SET_NICKNAME:
      if (newState[action.roomId][action.id]) {
        newState[action.roomId][action.id].nickname = action.nickname;
      }
      return newState;
    case INCREMENT_SCORE:
      newState[action.roomId][action.id].score += 1;
      return newState;
    case DECREMENT_SCORE:
      newState[action.roomId][action.id].score -= 1;
      return newState;
    default:
      return state;
  }
}

module.exports = players;
