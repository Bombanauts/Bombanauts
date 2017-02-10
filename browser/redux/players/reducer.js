import {
  UPDATE_PLAYER_LOCATIONS,
  ADD_PLAYER,
  REMOVE_PLAYER,
  SET_NICKNAME
} from './constants'

const initialState = {};

//the players are stored in the state each with a key of their socket id, with a property of an object containing their x, y, z coordinates
export const players = (state = initialState, action) => {
  let newState = Object.assign({}, state);
  switch (action.type) {
    case UPDATE_PLAYER_LOCATIONS:
      newState = action.otherPlayers;
      return newState;
    case ADD_PLAYER:
      newState[action.player.id] = action.player.position;
      return newState;
    case REMOVE_PLAYER:
      delete newState[action.id]
      return newState;
    default:
      return state;
  }
}
