import { UPDATE_PLAYER_LOCATIONS, ADD_PLAYER, REMOVE_PLAYER } from './constants';

export const updatePlayerLocations = (otherPlayers) => ({
  type: UPDATE_PLAYER_LOCATIONS,
  otherPlayers
});

export const addPlayer = (player) => ({
  type: ADD_PLAYER,
  player
});

export const removePlayer = (id) => ({
  type: REMOVE_PLAYER,
  id
});
