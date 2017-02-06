const { SET_WINNER } = require('./constants')

const setWinner = (playerId, roomId) => ({
		type: SET_WINNER,
		roomId,
		playerId
})

module.exports = {
	setWinner
}