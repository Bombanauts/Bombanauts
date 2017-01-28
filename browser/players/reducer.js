import {
  UPDATE_PLAYER_LOCATIONS,
  ADD_PLAYER,
  REMOVE_PLAYER
} from './constants';

const initialState = {
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
    case REMOVE_PLAYER:
      newState = Object.assign({}, state);
      delete newState[action.id]
      return newState;
    default:
      return state;
  }
}
