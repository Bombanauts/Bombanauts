import { ANNOUNCE_KILL, REMOVE_ANNOUNCEMENT } from './constants';

const initialState = {
  killerNickname: '',
  victimNickname: ''
}

export const announcement = (state = initialState, action) => {
  switch (action.type) {
    case ANNOUNCE_KILL:
      return Object.assign({}, state, action);
    case REMOVE_ANNOUNCEMENT:
      return initialState;
    default:
      return state;
  }
}

export const getKillerNickname = (state) => state.announcement.killerNickname;

export const getVictimNickname = (state) => state.announcement.victimNickname;
