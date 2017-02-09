const { expect } = require('chai')
const { ADD_BOMB, UPDATE_BOMB_POSITIONS, REMOVE_PLAYER_BOMBS } = require('../../server/bombs/constants')
const { addBomb, updateBombPositions, removePlayerBombs } = require('../../server/bombs/action-creator')

describe('Back end bomb action creators', () => {
  const newBomb = {
    userID: 1234,
    position: {
      x: 1.23,
      y: 5.12413,
      z: 9.124
    }
  }
  const bombPositions = {
    userId: 1234,
    bombs: [{ id: 1, position: { x: 1, y: 2, z: 3 }, created: 12345 },
            { id: 2, position: { x: 5.12, y: 12, z: 5 }, created: 542 }
    ]
  }
  const userId = 1;

  describe('addBomb', () => {
    it('returns an object with the ADD_BOMB type', () => {
      expect(addBomb(newBomb, 2).type).to.equal(ADD_BOMB)
    })

    it('returns an object with the passed in bomb object on it\'s newBomb property', () => {
      expect(addBomb(newBomb, 2).newBomb).to.be.deep.equal(newBomb)
    })
  })

  describe('updateBombPositions', () => {
    it('returns an object with the UPDATE_BOMB_POSITIONS type', () => {
      expect(updateBombPositions(newBomb, 2).type).to.equal(UPDATE_BOMB_POSITIONS)
    })

    it('returns an object with the passed in player id and bombs array  on it\'s bombs property', () => {
      expect(updateBombPositions(bombPositions, 2).bombs).to.be.deep.equal(bombPositions)
    })
  })

  describe('removePlayerBombs', () => {
    it('returns an object with the REMOVE_PLAYER_BOMBS type', () => {
      expect(removePlayerBombs(userId, 2).type).to.equal(REMOVE_PLAYER_BOMBS)
    })

    it('returns an object with the passed in user ID on it\'s id property', () => {
      expect(removePlayerBombs(userId, 2).id).to.equal(userId)
    })
  })
})
