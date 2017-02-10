import { expect } from 'chai'
import { createStore } from 'redux'
import { SET_WINNER } from '../../server/winner/constants'
import { setWinner } from '../../server/winner/action-creator'
import initialState from '../../server/winner/init-state'
import winnerReducer from '../../server/winner/reducer'

describe('Back end winner action creators', () => {
  const playerId = 'thisIsAnId'
  const roomId = 'Earth'

  describe('setWinner', () => {
    it('returns the correct winner based on playerId', () => {
      expect(setWinner(playerId, roomId).type).to.equal(SET_WINNER)
    })
  })
})

describe('Back end winner reducer', () => {
  let testStore;
  const playerId = 'anotherId'
  const roomId = 'Mars'

  beforeEach('Create testing store', () => {
    testStore = createStore(winnerReducer);
  });

  it('has the expected initial state', () => {
    expect(testStore.getState()).to.be.deep.equal(initialState)
  })

  describe('SET_WINNER', () => {
    it('sets winner based on playerId', () => {
      testStore.dispatch({ type: SET_WINNER , playerId, roomId})

      expect(testStore.getState()[roomId]).to.be.deep.equal(playerId)
    })
  })
})
