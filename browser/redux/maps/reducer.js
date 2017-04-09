import { GENERATE_MAP } from './constants';

export const map = (state = {}, action) => {
  const newState = Object.assign({}, state);
  switch (action.type) {
    case GENERATE_MAP:
      newState = action.map;
      break;
    default:
      return state;
  }

  return newState;
}
