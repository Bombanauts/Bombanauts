const {
  GET_PLAYERS,
  UPDATE_PLAYERS,
  REMOVE_PLAYER,
  KILL_PLAYER,
  SET_NICKNAME
} = require('./constants');

const {updatePlayers} = require('./action-creator');
const store = require('../store');

const initialState = require('./init-state');

//players reducer has initial state of all of the room names, each of which is a key for an object that contains keys of players' IDs and properties of an object containing that player's position and their death status
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
            dead: action.player.dead
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
      delete newState[action.roomId][action.id]
      return newState;
    case KILL_PLAYER:
      if (newState[action.roomId][action.id]) newState[action.roomId][action.id].dead = true;
      return newState;
    case SET_NICKNAME:
    if (action.id) {
      newState[action.roomId][action.id].nickname = action.nickname;
    }
      return newState;
    default:
      return state;
  }
}

module.exports = players;
