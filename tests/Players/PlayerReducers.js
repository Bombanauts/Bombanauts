const {expect} = require('chai');
const { GET_PLAYERS, UPDATE_PLAYERS, REMOVE_PLAYER } = require('../../server/players/constants');
const { players } = require('../../server/players/reducer');

describe('Player Reducer', () => {
  it('return default state if action.type has no case', () => {
    expect(players()).to.equal({})
  })

  // GET PLAYERS DOESN'T MAKE SENSE
  // it('GET_PLAYERS', () => {
  //   const action = {type: GET_PLAYERS, players: 'socketID'}
  //   expect(players({}, state)).to.equal(state)
  // })

  it('UPDATE_PLAYERS', () => {
    let prevState = { players: ['one', 'two'] }
    expect().to.equal()
  })

  it('REMOVE_PLAYER', () => {
    expect().to.equal()
  })

})
