const {expect} = require('chai');
const { GET_PLAYERS, UPDATE_PLAYERS, REMOVE_PLAYER } = require('../../server/players/constants');
const { getPlayers, updatePlayers, removePlayer } = require('../../server/players/action-creator');

describe('Player Action Creators Tests', () => {

  describe('getPlayers function', () => {
    it('should return an object with type', () => {
      expect(getPlayers(2)).to.deep.equal({ type: GET_PLAYERS, roomId: 2 })
    })
  })

  describe('updatePlayers', () => {
    it('should return an object with players and type', () => {
      expect(updatePlayers('player1', 2)).to.deep.equal({ type: UPDATE_PLAYERS, player: 'player1', roomId: 2})
    })
  })

  describe('removePlayer', () => {
    it('should return an object with id and type', () => {
      expect(removePlayer(1, 2)).to.deep.equal({ type: REMOVE_PLAYER, id: 1, roomId: 2 })
    })
  })
})
