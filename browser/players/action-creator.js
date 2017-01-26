import {
  GET_PLAYERS_LOCATIONS,
  ADD_PLAYER
} from './constants';

export const getPlayersPosition = (players) => ({
  type: GET_PLAYERS_LOCATIONS,
  players
});

export const addPlayer = (player) => ({
  type: ADD_PLAYER,
  player
});

// export const getPlayersLocations = (players) => ({
//   type: GET_ALL_PLAYERS,
//   players
// });
