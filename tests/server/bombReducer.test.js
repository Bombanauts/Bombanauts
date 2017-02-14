import { expect } from 'chai'
import { createStore } from 'redux'
import { ADD_BOMB, UPDATE_BOMB_POSITIONS, REMOVE_PLAYER_BOMBS } from '../../server/redux/bombs/constants'
import bombReducer from '../../server/redux/bombs/reducer'
import initialState from '../../server/redux/bombs/init-state'

describe('Back end bombs reducer', () => {
  let testStore;
  const room = 'Wolf 1061b'
  const roomB = 'Wolf 1061c'
  const userId = 1234
  const userIdB = 5678
  const bombId = 1
  const bombIdB = 2
  const bombPosition = { x: 1, y: 2, z: 3 }
  const bombPositionB = { x: 5.12, y: 12, z: 5 }

  beforeEach('Create testing store', () => {
    testStore = createStore(bombReducer);
  });

  it('has the expected initial state', () => {
    expect(testStore.getState()).to.be.deep.equal(initialState)
  })

  describe('ADD_BOMB', () => {
    it('adds a key of the user\'s ID to the state, with the property of an array of that user\'s bombs, each with ID & position', () => {
      testStore.dispatch({ type: ADD_BOMB, newBomb: { userId: userId, position: bombPosition, bombId: bombId }, roomId: room })

      expect(testStore.getState()[room]).to.be.deep.equal({
        [userId]: [{ id: bombId, position: bombPosition }]
      })
    })

    it('adds a new user ID key and bomb to the state object if that user does not already have bombs on the state', () => {
      testStore.dispatch({ type: ADD_BOMB, newBomb: { userId: userIdB, position: bombPositionB, bombId: bombIdB }, roomId: room })

      expect(testStore.getState()[room]).to.be.deep.equal({
        [userId]: [{ id: bombId, position: bombPosition }],
        [userIdB]: [{ id: bombIdB, position: bombPositionB }]
      })
    })

    it('if a user ID is already on the state, push the newly added bomb onto that user\'s ID\'s bombs array', () => {
      testStore.dispatch({ type: ADD_BOMB, newBomb: { userId: userId, position: bombPositionB, bombId: bombIdB }, roomId: room })
      expect(testStore.getState()[room]).to.be.deep.equal({
        [userId]: [{ id: bombId, position: bombPosition }, { id: bombIdB, position: bombPositionB }],
        [userIdB]: [{ id: bombIdB, position: bombPositionB }]
      })
    })
  })

  describe('UPDATE_BOMB_POSITIONS', () => {
    it('replaces the user\'s previous bombs array with the new passed in array of bombs', () => {
      testStore.dispatch({ type: UPDATE_BOMB_POSITIONS, bombs: { userId: userId, bombs: [{ id: bombId, position: bombPositionB }] }, roomId: room })
      testStore.dispatch({ type: UPDATE_BOMB_POSITIONS, bombs: { userId: userIdB, bombs: [{ id: bombIdB, position: bombPosition }] }, roomId: room })

      expect(testStore.getState()[room]).to.be.deep.equal({
          [userId]: [{ id: bombId, position: bombPositionB }],
          [userIdB]: [{ id: bombIdB, position: bombPosition }]
      })
    })
  })

  describe('REMOVE_PLAYER_BOMBS', () => {
    it('deletes the user\'s ID key off of the allBombs property on the state', () => {
      testStore.dispatch({ type: REMOVE_PLAYER_BOMBS, id: userId, roomId: room })

      expect(testStore.getState()[room]).to.be.deep.equal({
          [userIdB]: [{ id: bombIdB, position: bombPosition }]
      })
    })
  })

  describe('Separate rooms', () => {
    it('changes the state in the given room that was passed in by ID in the action creator', () => {
      expect(testStore.getState()[roomB]).to.be.deep.equal({})
    })

    it('will update the one specified room while leaving others unchanged', () => {
      testStore.dispatch({ type: ADD_BOMB, newBomb: { userId: userId, position: bombPositionB, bombId: bombIdB }, roomId: roomB })

      expect(testStore.getState()[roomB]).to.be.deep.equal({
        [userId]: [{ id: bombIdB, position: bombPositionB }]
      })

      expect(testStore.getState()[room]).to.be.deep.equal({
        [userIdB]: [{ id: bombIdB, position: bombPosition }]
      })

    })
  })
})
