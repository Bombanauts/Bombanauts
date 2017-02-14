import { expect } from 'chai'
import { createStore } from 'redux'
import { SET_TIME, GET_TIME } from '../../server/redux/timer/constants'
import { setTime, getTime } from '../../server/redux/timer/action-creator'
import initialState from '../../server/redux/timer/init-state'
import timerReducer from '../../server/redux/timer/reducer'

describe('Back end timer reducer', () => {
  let testStore;
  const room = 'Wolf 1061b'

  beforeEach('Create testing store', () => {
    testStore = createStore(timerReducer)
  })

  it('has the expected initial state', () => {
    expect(testStore.getState()).to.be.deep.equal(initialState)
  })

  describe('SET_TIME', () => {
    it('sets the end time on the reducer to the current time plus roughly 3 minutes', () => {
      let time = Date.now();

      testStore.dispatch(setTime(time, room))

      expect(testStore.getState()[room].endTime).to.be.a('number')
      expect(testStore.getState()[room].endTime).to.be.above(1487101600000)
    })
  })

  describe('GET_TIME', () => {
    it('sets the current time on the state', () => {
      let time = Date.now();

      testStore.dispatch(setTime(time, room))
      testStore.dispatch(getTime(room))

      expect(testStore.getState()[room].currTime).to.be.a('number')
    })
  })
})
