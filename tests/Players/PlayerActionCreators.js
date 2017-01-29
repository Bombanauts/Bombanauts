const {expect} = require('chai');
const { GET_PLAYERS, UPDATE_PLAYERS, REMOVE_PLAYER } = require('../../server/players/constants');
const { getPlayers, updatePlayers, removePlayer } = require('../../server/players/action-creator');

describe('Player Action Creators Tests', () => {

  TODO: // getPlayers Function doesn't make sense
  describe('getPlayers function', () => {
    // it('should return an object with type and players', () => {
    //   const actionCreator = getPlayers()
    // })
  })

  describe('updatePlayers', () => {
    it('should return an object with players and type', () => {
      expect(updatePlayers('player1')).to.deep.equal({ type: UPDATE_PLAYERS, player: 'player1' })
    })
  })

  describe('removePlayer', () => {
    it('should return an object with id and type', () => {
      expect(removePlayer(1)).to.deep.equal({ type: REMOVE_PLAYER, id: 1 })
    })
  })
})
