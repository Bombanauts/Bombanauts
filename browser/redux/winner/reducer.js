import { SET_WINNER } from './constants'

const initialState = null;

const winner = (state = initialState, action) => {
	switch(action.type) {
		case SET_WINNER:
			let newState = action.playerId
			return newState
		default:
			return state
	}
}

export default winner
