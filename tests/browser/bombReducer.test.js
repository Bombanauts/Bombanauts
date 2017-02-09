import React from 'react'
import { createStore } from 'redux'
import chai, { expect } from 'chai'

import { updateBombLocations, removePlayerBombs } from '../../browser/bombs/action-creator'
import { bombs } from '../../browser/bombs/reducer'
import * as types from '../../browser/bombs/constants'

describe('Front end bomb reducer', () => {
  let testStore;
  beforeEach('Create testing store from reducer', () => {
    testStore = createStore(bombs);
  })

  it('has an initial state of an empty object', () => {
    expect(testStore.getState()).to.be.deep.equal({});
  })

  describe('UPDATE_BOMB_LOCATIONS', () => {
    it('adds a player\'s bombs to the state with their ID as the key and an array of bombs as the property', () => {
      const bomb = {
        UidDcC7s6X6QrYr2AAAB: [{ position: { x: 1, y: 1, z: 1 } }]
      }
      testStore.dispatch({
        type: types.UPDATE_BOMB_LOCATIONS,
        allBombs: bomb
      })

      expect(testStore.getState()).to.be.deep.equal(bomb)
    })

    it('creates a NEW state object on any dispatched action', () => {
      const firstState = testStore.getState()
      testStore.dispatch({
        type: types.UPDATE_BOMB_LOCATIONS,
        allBombs: {}
      })

      expect(testStore.getState()).to.not.be.equal(firstState)
    })
  })

  describe('REMOVE_PLAYER_BOMBS', () => {
    it('removes the specified player\'s bombs', () => {
      const id = 'UidDcC7s6X6QrYr2AAAB'
      const bomb = {
        [id]: [{ position: { x: 1, y: 1, z: 1 } }]
      }

      testStore.dispatch({
        type: types.UPDATE_BOMB_LOCATIONS,
        allBombs: bomb
      })
      testStore.dispatch({
        type: types.REMOVE_PLAYER_BOMBS,
        id
      })

      expect(testStore.getState()).to.be.deep.equal({})
    })

    it('does not remove other player\'s bombs', () => {
      const id = 'UidDcC7s6X6QrYr2AAAB'
      const idB = 'lndasklasnd'
      const bomb = {
        [id]: [{ position: { x: 1, y: 1, z: 1 } }]
      }
      const bombB = {
        [idB]: [{ position: { x: 1, y: 1, z: 1 } }]
      }

      testStore.dispatch({
        type: types.UPDATE_BOMB_LOCATIONS,
        allBombs: bomb
      })
      testStore.dispatch({
        type: types.UPDATE_BOMB_LOCATIONS,
        allBombs: bombB
      })
      testStore.dispatch({
        type: types.REMOVE_PLAYER_BOMBS,
        id: idB
      })

      expect(testStore.getState()).to.be.deep.equal(bomb)
    })
  })

})
