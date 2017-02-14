import { expect } from 'chai'
import { createStore } from 'redux'
import {
  GET_PLAYERS,
  UPDATE_PLAYERS,
  REMOVE_PLAYER,
  KILL_PLAYER,
  SET_NICKNAME
} from '../../server/redux/players/constants'
import playerReducer from '../../server/redux/players/reducer'
import initialState from '../../server/redux/players/init-state'

describe('Back end player reducer', () => {
  let testStore;
  const room = 'Wolf 1061b'
  const roomB = 'Wolf 1061c'

  beforeEach('Create test store', () => {
    testStore = createStore(playerReducer)
  })

  describe('default state', () => {
    it('has the expected initial state', () => {
      expect(testStore.getState()).to.be.deep.equal(initialState)
    })

    it('return default state if action.type has no case', () => {
      testStore.dispatch({ type: 'gibberish', gibberish: 'mo gibberish' })
      expect(testStore.getState()).to.deep.equal(initialState)
    })
  })

  describe('GET_PLAYERS', () => {
    it('returns the given players for that room', () => {
      testStore.dispatch({ type: UPDATE_PLAYERS, player: { id: 10, position: { x: 1, y: 2, z: 3 }, dead: false }, nickname: 'sam', roomId: room })

      expect(testStore.getState()[room]).to.be.deep.equal({
        '10': { x: 1, y: 2, z: 3, dead: false, nickname: '', score: 0 }
      })
    })
  })

  describe('UPDATE_PLAYERS', () => {
    it('updates the given information for hte passed in player ID', () => {
      testStore.dispatch({ type: UPDATE_PLAYERS, player: { id: 10, position: { x: 4, y: 5, z: 6 }, dead: true }, nickname: 'sam', roomId: room })

      expect(testStore.getState()[room]).to.be.deep.equal({
        '10': { x: 4, y: 5, z: 6, dead: true , nickname: '', score: 0}
      })
    })

    it('will add a new player to the state when a new ID is passed in', () => {
      testStore.dispatch({ type: UPDATE_PLAYERS, player: { id: 11, position: { x: 1, y: 2, z: 3 }, dead: false }, nickname: 'damon', roomId: room })

      expect(testStore.getState()[room]).to.be.deep.equal({
        '10': { x: 4, y: 5, z: 6, dead: true, nickname: '', score: 0 },
        '11': { x: 1, y: 2, z: 3, dead: false, nickname: '', score: 0 }
      })
    })
  })

  describe('SET_NICKNAME', () => {
    it('sets the nickname for the given player ID', () => {
      testStore.dispatch({ type: UPDATE_PLAYERS, player: { id: 10, position: { x: 4, y: 5, z: 6 }, dead: true }, nickname: 'sam', roomId: room })
      testStore.dispatch({ type: UPDATE_PLAYERS, player: { id: 11, position: { x: 1, y: 2, z: 3 }, dead: false }, nickname: 'damon', roomId: room })
      testStore.dispatch({ type: SET_NICKNAME, id: 10, nickname: 'sam', roomId: room })
      testStore.dispatch({ type: SET_NICKNAME, id: 11, nickname: 'damon', roomId: room})

      expect(testStore.getState()[room]).to.be.deep.equal({
        '10': { x: 4, y: 5, z: 6, dead: true, nickname: 'sam', score: 0 },
        '11': { x: 1, y: 2, z: 3, dead: false, nickname: 'damon', score: 0}
      })
    })
  })


  describe('REMOVE_PLAYER', () => {
    it('removes the player from the state', () => {
      testStore.dispatch({ type: REMOVE_PLAYER, id: 10, roomId: room })

      expect(testStore.getState()[room]).to.be.deep.equal({
        '11': { x: 1, y: 2, z: 3, dead: false, nickname: 'damon', score: 0 }
      })
    })
  })

  describe('Separate rooms', () => {
    it('changes the state in the given room that was passed in by ID in the action creator', () => {
      expect(testStore.getState()[roomB]).to.be.deep.equal({})
    })

    it('will update the one specified room while leaving others unchanged', () => {
      testStore.dispatch({ type: UPDATE_PLAYERS, player: { id: 10, position: { x: 4, y: 5, z: 6 }, dead: true }, nickname: 'sam', roomId: roomB })

      expect(testStore.getState()[roomB]).to.be.deep.equal({
        '10': { x: 4, y: 5, z: 6, dead: true, nickname: '', score: 0 }
      })

      expect(testStore.getState()[room]).to.be.deep.equal({
        '11': { x: 1, y: 2, z: 3, dead: false, nickname: 'damon', score: 0 }
      })
    })
  })
})
