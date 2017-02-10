'use strict'
import { createStore } from 'redux'
import { expect } from 'chai'
import { setWinner } from '../../browser/redux/winner/action-creator'
import * as types from '../../browser/redux/winner/constants'
import winner from '../../browser/redux/winner/reducer'

describe('Front end winner action creator', () => {
  describe('setWinner', () => {
    it('returns expected action description', () => {
      const playerId = {
        playerId: 'thisIsThePlayerId'
      }
      const expectedAction = {
        type: types.SET_WINNER,
        playerId
      }
      expect(setWinner(playerId)).to.be.deep.equal(expectedAction)
    })
  })
})

describe('Front end winner reducer', () => {
  let testStore;
  beforeEach('Create testing store from reducer', () => {
    testStore = createStore(winner);
  })

  it('has an initial state of null', () => {
    expect(testStore.getState()).to.be.deep.equal(null);
  })

  describe('SET_WINNER', () => {
    it('sets winner based on playerId', () => {
      const playerId = 'anotherPlayerId'
      
      testStore.dispatch({
        type: types.SET_WINNER,
        playerId
      })
      console.log(winner)
      expect(testStore.getState()).to.be.deep.equal(playerId)
    })
  })
})
