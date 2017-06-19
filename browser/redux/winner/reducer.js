import { SET_WINNER } from './constants';

const winner = (state = null, action) => {
  switch (action.type) {
    case SET_WINNER:
      return action.playerId;
    default:
      return state;
  }
}

export default winner;

export const getWinner = (state) => state.winner;
