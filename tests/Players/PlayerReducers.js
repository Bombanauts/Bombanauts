const {expect} = require('chai');
const { GET_PLAYERS, UPDATE_PLAYERS, REMOVE_PLAYER } = require('../../server/players/constants');
const players = require('../../server/players/reducer');

describe('Player Reducer', () => {
  it('return default state if action.type has no case', () => {
    expect(players({}, {gibberish: 'mo gibberish' })).to.deep.equal({})
  })

  it('GET_PLAYERS', () => {
    const state = {
      id: 'stuff'
    }

    const action = {
      type: GET_PLAYERS
    }

    expect(players(state, action)).to.equal(state)
  })

  it('UPDATE_PLAYERS', () => {
    const prevState = { id1: 'x1y1z1', id2: 'x2y2z2' }

    const action = {
      type: UPDATE_PLAYERS,
      player: { id: 'id3', position: 'x3y3z3' }
    }
    expect(players(prevState, action)).to.deep.equal(Object.assign({}, prevState, { id3: 'x3y3z3' }))
  })

  it('REMOVE_PLAYER', () => {
    const prevState = { id1: 'x1y1z1', id2: 'x2y2z2' }

    const action = {
      type: REMOVE_PLAYER,
      id: 'id1'
    }

    expect(players(prevState, action)).to.deep.equal({ id2: 'x2y2z2'})
  })

})
