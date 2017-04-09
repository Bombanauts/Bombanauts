import { SET_WINNER } from './constants';

export const setWinner = (playerId) => ({
  type: SET_WINNER,
  playerId
});
