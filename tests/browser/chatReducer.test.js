const { expect } = require('chai')
const { START_CHAT, STOP_CHAT } = require('../../browser/chat/constants')
const { isChatting } = require('../../browser/chat/reducer')
const { createStore } = require('redux')

describe('Chat System reducer', () => {

  let testStore;
  beforeEach(() => {
    testStore = createStore(isChatting)
  })

  it('should return the default state is action type is not found', () => {
    let storeStateBefore = testStore.getState()
    testStore.dispatch({ type: 'NOT VALID ACTION'})
    let storeStateAfter = testStore.getState()

    expect(storeStateBefore).to.be.false
    expect(storeStateBefore).to.equal(storeStateAfter)
  })

  it('should set the initial state to true after sending START_CHAT', () => {
    testStore.dispatch({ type: START_CHAT})
    expect(testStore.getState()).to.be.true
  })

  it('should set the state to false after sending STOP_CHAT', () => {
    testStore.dispatch({ type: START_CHAT})
    expect(testStore.getState()).to.be.true
    testStore.dispatch({ type: STOP_CHAT})
    expect(testStore.getState()).to.be.false
  })
})
