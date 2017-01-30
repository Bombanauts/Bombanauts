const { expect } = require('chai')
const { createStore } = require('redux')
const { ADD_BOMB, UPDATE_BOMB_POSITIONS, REMOVE_PLAYER_BOMBS } = require('../../server/bombs/constants')
const bombReducer = require('../../server/bombs/reducer')

describe('Server side bomb reducer', () => {
  let testStore;
  const initialState = { allBombs: {} }
  const userId = 1234;
  const userIdB = 5678;
  const bombPosition = { x: 1, y: 2, z: 3 }
  const bombPositionB = { x: 5.12, y: 12, z: 5 }

  beforeEach('Create testing store', () => {
    testStore = createStore(bombReducer);
  });

  it('has the expected initial state', () => {
    expect(testStore.getState()).to.be.deep.equal(initialState)
  })

  describe('ADD_BOMB', () => {
    it('adds a key of the user\'s ID to the state\'s allBombs object, with the property of an array of that user\'s bombs', () => {
      testStore.dispatch({ type: ADD_BOMB, newBomb: { userId: userId, position: bombPosition } })

      expect(testStore.getState()).to.be.deep.equal({ allBombs: {
          [userId]: [{ position: bombPosition }] } })
    })

    it('adds a new user ID key and bomb to the state\'s allBombs object if that user does not already have bombs on the state', () => {
      testStore.dispatch({ type: ADD_BOMB, newBomb: { userId: userIdB, position: bombPositionB } })

      expect(testStore.getState()).to.be.deep.equal({
        allBombs: {
          [userId]: [{ position: bombPosition }],
          [userIdB]: [{ position: bombPositionB }]
        }
      })
    })

    it('if a user ID is already on the state, push the newly added bomb onto that user\'s IDs bombs array', () => {
      testStore.dispatch({ type: ADD_BOMB, newBomb: { userId: userId, position: bombPositionB } })
      expect(testStore.getState()).to.be.deep.equal({
        allBombs: {
          [userId]: [{ position: bombPosition }, { position: bombPositionB }],
          [userIdB]: [{ position: bombPositionB }]
        }
      })
    })
  })

  describe('UPDATE_BOMB_POSITIONS', () => {
    it('replaces the user\'s previous bombs array with the new passed in array of bombs', () => {
      testStore.dispatch({ type: UPDATE_BOMB_POSITIONS, bombs: { userId: userId, bombs: [{ position: bombPositionB }] }})
      testStore.dispatch({ type: UPDATE_BOMB_POSITIONS, bombs: { userId: userIdB, bombs: [{ position: bombPosition }] }})

      expect(testStore.getState()).to.be.deep.equal({
        allBombs: {
          [userId]: [{ position: bombPositionB }],
          [userIdB]: [{ position: bombPosition }]
        }
      })
    })
  })

  describe('REMOVE_PLAYER_BOMBS', () => {
    it('deletes the user\'s ID key off of the allBombs property on the state', () => {
      testStore.dispatch({ type: REMOVE_PLAYER_BOMBS, id: userId })

      expect(testStore.getState()).to.be.deep.equal({
        allBombs: {
          [userIdB]: [{ position: bombPosition }]
        }
      })
    })
  })
})
