import React from 'react'
import { createStore } from 'redux'
import chai, { expect } from 'chai'

import {
  updatePlayerLocations,
  addPlayer,
  removePlayer
} from '../../browser/players/action-creator'
import { players } from '../../browser/players/reducer'
import * as types from '../../browser/players/constants'

describe('Front end player reducer', () => {
  let testStore;
  beforeEach('Create testing store from reducer', () => {
    testStore = createStore(players);
  })

  it('has an initial state of an empty object', () => {
    expect(testStore.getState()).to.be.deep.equal({});
  })

  describe('UPDATE_PLAYER_LOCATIONS', () => {
    it('affects state by updating player locations', () => {
      testStore.dispatch({
        type: types.UPDATE_PLAYER_LOCATIONS,
        otherPlayers: [{ id: 1, position: 2 }]
      })

      expect(testStore.getState()).to.be.deep.equal([{ id: 1, position: 2 }])
    })

    it('creates a NEW state object on any dispatched action', () => {
      const firstState = testStore.getState()
      testStore.dispatch({
        type: types.UPDATE_PLAYER_LOCATIONS,
        otherPlayers: [{ id: 1, position: 2 }]
      })

      expect(firstState).to.not.be.equal(testStore.getState())
    })
  })

  describe('ADD_PLAYER', () => {
    it('adds a new player to the state, storing them under a key of their ID', () => {
      const player = {
        position: { x: 2, y: 2, z: 2 },
        id: 'asdasdasd'
      }

      testStore.dispatch({
        type: types.ADD_PLAYER,
        player
      })

      expect(testStore.getState()).to.be.deep.equal({ asdasdasd: { x: 2, y: 2, z: 2 } })
    })
  })

  describe('REMOVE_PLAYER', () => {
    it('removes a player from the state', () => {
      const player = {
        position: { x: 2, y: 2, z: 2 },
        id: 1
      }
      const playerB = {
        position: { x: 2, y: 2, z: 2 },
        id: 2
      }

      testStore.dispatch({
        type: types.ADD_PLAYER,
        player
      })
      testStore.dispatch({
        type: types.ADD_PLAYER,
        player: playerB
      })

      testStore.dispatch({
        type: types.REMOVE_PLAYER,
        id: 1
      })

      expect(testStore.getState()).to.be.deep.equal({ 2: { x: 2, y: 2, z: 2 } })
    })
  })
})
