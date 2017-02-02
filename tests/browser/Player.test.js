'use strict'

import React from 'react'
import { createStore } from 'redux'
import chai, { expect } from 'chai'

import { updatePlayerLocations, addPlayer, removePlayer } from '../../browser/players/action-creator'
import { players } from '../../browser/players/reducer'
import * as types from '../../browser/players/constants'

describe('Player action-creators', () => {

  describe('updatePlayerLocations', () => {

    it('returns expected action description', () => {

      const otherPlayers = {
        position: { x: 1, y: 1, z: 1 }
      }
      const expectedAction = {
        type: types.UPDATE_PLAYER_LOCATIONS,
        otherPlayers
      }

      expect(updatePlayerLocations(otherPlayers)).to.be.deep.equal(expectedAction)
    })
  })

  describe('addPlayer', () => {

    it('returns expected action description', () => {

      const player = {
        position: { 'x': 2, 'y': 2, 'z': 2 },
        'id': 1
      }
      const expectedAction = {
        type: types.ADD_PLAYER,
        player
      }

      expect(addPlayer(player)).to.be.deep.equal(expectedAction)
    })
  })

  describe('removePlayer', () => {

    it('returns expected action description', () => {

      const id = 2

      const expectedAction = {
        type: types.REMOVE_PLAYER,
        id
      }

      expect(removePlayer(id)).to.be.deep.equal(expectedAction)
    })
  })

})

describe('Player reducer', () => {

  let testingStore;
  beforeEach('Create testing store from reducer', () => {
    testingStore = createStore(players);
  })

  it('has an initial state as described', () => {
    const currentStoreState = testingStore.getState();
    expect(currentStoreState.otherPlayers).to.be.deep.equal({});
  })

  describe('reducing on UPDATE_PLAYER_LOCATIONS', () => {

    it('affects state by updating player locations', () => {
      testingStore.dispatch({
        type: types.UPDATE_PLAYER_LOCATIONS,
        otherPlayers: {}
      })
      const newState = testingStore.getState()

      expect(newState.otherPlayers).to.be.deep.equal({})
    })

    it('creates a NEW state object on any dispatched action', () => {
      const currentState = testingStore.getState()

      testingStore.dispatch({
        type: types.UPDATE_PLAYER_LOCATIONS,
        otherPlayers: {}
      })

      const newState = testingStore.getState()

      expect(currentState).to.not.be.equal(newState)
    })
  })

  describe('reducing on ADD_PLAYER', () => {


    it('affects state by adding a new player', () => {

      const player = {
        position: { 'x': 2, 'y': 2, 'z': 2 },
        'id': 'asdasdasd'
      }
      const initialState = testingStore.getState();

      testingStore.dispatch({
        type: types.ADD_PLAYER,
        player
      })
      const newState = testingStore.getState()
      expect(newState.otherPlayers).to.be.deep.equal({ 'asdasdasd': { 'x': 2, 'y': 2, 'z': 2 } })
    })
  })

  describe('reducing on REMOVE_PLAYER', () => {

    it('affects state by removing a player', () => {

      const initialState = testingStore.getState();
      testingStore.dispatch({
        type: types.REMOVE_PLAYER,
        id: 'asdasdasd'
      })

      const newState = testingStore.getState()

      expect(newState.otherPlayers).to.be.deep.equal({})
    })
  })

})
