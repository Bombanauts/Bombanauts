const {expect} = require('chai');
const { createStore } = require('redux');
const { GET_PLAYERS, UPDATE_PLAYERS, REMOVE_PLAYER } = require('../../server/players/constants');
const playerReducer = require('../../server/players/reducer');

describe('Player Reducer', () => {
  let testStore;

  beforeEach('Create test store', () => {
    testStore = createStore(playerReducer)
  })

  it('return default state if action.type has no case', () => {
    testStore.dispatch({ type: 'gibberish', gibberish: 'mo gibberish' })  // 'mo gibberish' lol
    expect(testStore.getState()).to.deep.equal({})
  })

  it('GET_PLAYERS', () => {
    const state = {
      id: 'stuff'
    }

    const action = {
      type: GET_PLAYERS
    }

    expect(playerReducer(state, action)).to.equal(state)
  })

  it('UPDATE_PLAYERS', () => {
    const action1 = {
      type: UPDATE_PLAYERS,
      player: { id: 'id1', position: 'x1y1z1' }
    }

    const action2 = {
      type: UPDATE_PLAYERS,
      player: { id: 'id2', position: 'x2y2z2' }
    }

    const action3 = {
      type: UPDATE_PLAYERS,
      player: { id: 'id3', position: 'x3y3z3' }
    }

    const sol1 = { id1: 'x1y1z1' }
    const sol2 = { id2: 'x2y2z2' }
    const sol3 = { id3: 'x3y3z3' }

    testStore.dispatch(action1)
    expect(testStore.getState()).to.deep.equal(sol1)
    testStore.dispatch(action2)
    expect(testStore.getState()).to.deep.equal(Object.assign({}, sol1, sol2))
    testStore.dispatch(action3)
    expect(testStore.getState()).to.deep.equal(Object.assign({}, sol1, sol2, sol3))
  })

  it('REMOVE_PLAYER', () => {
    testStore.dispatch({
      type: UPDATE_PLAYERS,
      player: { id: 'id1', position: 'x1y1z1' }
    })

    const remove1 = {
      type: REMOVE_PLAYER,
      id: 'id1'
    }

    testStore.dispatch(remove1)
    expect(testStore.getState()).to.deep.equal({})
  })

})
