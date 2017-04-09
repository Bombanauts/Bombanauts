import { GENERATE_MAP } from './constants';

export const map = (state = {}, action) => {
  switch (action.type) {
    case GENERATE_MAP:
      return action.map;
    default:
      return state;
  }

  return newState;
};
