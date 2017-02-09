import { GENERATE_MAP } from './constants';


const initialState = {
}

export const map = (state = initialState, action) => {
  let newState = Object.assign({}, state)
  switch (action.type) {
    case GENERATE_MAP:
      newState = action.map
      break;
    default:
      return state;
  }
  return newState;
}
