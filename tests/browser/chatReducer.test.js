import { expect } from 'chai'
import { START_CHAT, STOP_CHAT } from '../../browser/redux/chat/constants'
import { chat } from '../../browser/redux/chat/reducer'
import { createStore } from 'redux'

describe('Chat System reducer', () => {

  let testStore;

  beforeEach(() => {
    testStore = createStore(chat)
  })

  it('should return the default state is action type is not found', () => {
    let storeStateBefore = testStore.getState()
    testStore.dispatch({ type: 'NOT VALID ACTION'})
    let storeStateAfter = testStore.getState()

    expect(storeStateBefore).to.deep.equal(storeStateAfter)
  })

  it('should set the initial state to true after sending START_CHAT', () => {
    testStore.dispatch({ type: START_CHAT})
    expect(testStore.getState().isChatting).to.be.true
  })

  it('should set the state to false after sending STOP_CHAT', () => {
    testStore.dispatch({ type: START_CHAT})
    expect(testStore.getState().isChatting).to.be.true
    testStore.dispatch({ type: STOP_CHAT})
    expect(testStore.getState().isChatting).to.be.false
  })
})
