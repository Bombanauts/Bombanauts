import { SET_WINNER } from './constants'

const initialState = {
	playerId: null
}

const winner = (state = initialState, action) => {
  let newState = Object.assign({}, state);
	switch(action.type) {
		case SET_WINNER:
			newState.playerId = action.playerId
			return newState
		default:
			return state
	}
}

export default winner