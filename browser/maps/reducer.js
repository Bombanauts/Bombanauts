import { GENERATE_MAP } from './constants';


const initialState = {
  mapState: []
}

export const mapState = (state = initialState, action) => {
  let newState = Object.assign({}, state)
  switch (action.type) {
    case GENERATE_MAP:
      newState.mapState = action.map
      break;
    default:
      return state;
  }

  return newState;
}
