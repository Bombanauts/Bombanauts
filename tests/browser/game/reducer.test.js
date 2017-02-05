const { expect } = require('chai')
const { KILL_PLAYER, killPlayer } = require('../../../browser/game/action-creator')
const { createStore } = require('redux')
const { dead } = require('../../../browser/game/reducer')

describe('Client Side Game Reducer', () => {

  let testStore;
  const initialState = { dead: false }

  beforeEach(() => {
    testStore = createStore(dead)
  })

  it.only('should have the right initialState', () => {
    expect(testStore.getState()).to.deep.equal(initialState)
  })

  it.only('should return the initial state if type is not found', () => {

    testStore.dispatch({ type: 'DO NOTHING' })
    expect(testStore.getState()).to.deep.equal(initialState)
  })

  it.only('should kill a player', () => {
    testStore.dispatch(killPlayer())
    expect(testStore.getState().dead).to.be.true
  })
})
