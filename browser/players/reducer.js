import {
  UPDATE_PLAYER_LOCATIONS,
  ADD_PLAYER
} from './constants';

let initialState = {
  otherPlayers: {}
};

export const players = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case UPDATE_PLAYER_LOCATIONS:
      newState = Object.assign({}, state);
      newState.otherPlayers = action.otherPlayers;
      return newState;
    case ADD_PLAYER:
      newState = Object.assign({}, state);
      newState.otherPlayers[action.player.id] = action.player.position;
      return newState;
    default:
      return state;
  }
}
