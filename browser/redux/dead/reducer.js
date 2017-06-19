import { KILL_PLAYER, REVIVE_PLAYER } from './action-creator.js';

export const dead = (state = false, action) => {
  switch (action.type) {
    case KILL_PLAYER:
      return true;
    case REVIVE_PLAYER:
      return false;
    default:
      return state;
  }
};

export const getDeadStatus = (state) => state.dead;
