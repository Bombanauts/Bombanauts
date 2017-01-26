import {
  GET_PLAYERS_LOCATIONS,
  ADD_PLAYER
} from './constants';

let initialState = {};

export const players = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET_PLAYERS_LOCATIONS:
      newState = Object.assign({}, state);
      newState.players = action.players;
      return newState;
    case ADD_PLAYER:
      newState = Object.assign({}, state);
      newState[action.player.id] = action.player.position;
      return newState;
    default:
      return state;
  }
}
