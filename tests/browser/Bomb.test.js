'use strict'  // Why suddenly here?

import React from 'react'
import { createStore } from 'redux'
import chai, { expect } from 'chai'

import { updateBombLocations, removePlayerBombs } from '../../browser/bombs/action-creator'
import { bombs } from '../../browser/bombs/reducer'
import * as types from '../../browser/bombs/constants'

describe ('Bomb action-creators', () => {

	describe('updateBombLocations', () => {

		it('returns expected action description', () => {

			const allBombs = {
				"UidDcC7s6X6QrYr2AAAB": [{position: {x: 1, y: 1, z: 1}}]
			}
			const expectedAction = {
				type: types.UPDATE_BOMB_LOCATIONS,
  			allBombs
			}

			expect(updateBombLocations(allBombs)).to.deep.equal(expectedAction)  // Grammar! :}
		})
	})

	describe('removePlayerBombs', () => {

		it('returns expected action description', () => {

			const id = "UidDcC7s6X6QrYr2AAAB"

			const expectedAction = {
				type: types.REMOVE_PLAYER_BOMBS,
				id
			}

			expect(removePlayerBombs(id)).to.deep.equal(expectedAction)
		})
	})

})

describe('Bomb reducer', () => {

  let testingStore;
  beforeEach('Create testing store from reducer', () => {
      testingStore = createStore(bombs);
  })

  it('has an initial state as described', () => {  // 'as described'?
      const currentStoreState = testingStore.getState();
      expect(currentStoreState.allBombs).to.deep.equal({});
  })

  describe('reducing on UPDATE_BOMB_LOCATIONS', () => {

  	it('affects state by updating bomb locations', () => {

			const allBombs = {
				"UidDcC7s6X6QrYr2AAAB": [{position: {x: 1, y: 1, z: 1}}]
			}

  		testingStore.dispatch({
  			type: types.UPDATE_BOMB_LOCATIONS,
  			allBombs
  		})
  		const newState = testingStore.getState()

  		expect(newState.allBombs).to.deep.equal(allBombs)
  	})

  	it('creates a NEW state object on any dispatched action', () => {
  		const currentState = testingStore.getState()

  		testingStore.dispatch({
  			type: types.UPDATE_BOMB_LOCATIONS,
  			allBombs: {}
  		})

  		const newState = testingStore.getState()

  		expect(currentState).to.not.equal(newState)  // You don't need `be`, fwiw
  	})
  })

  describe('reducing on REMOVE_PLAYER_BOMBS', () => {


  	it('affects state by removing a players bombs', () => {

			const id = "UidDcC7s6X6QrYr2AAAB"  // Why have such elaborate id's in some files and simple ones in others?

  		const initialState = testingStore.getState();

  		testingStore.dispatch({
  			type: types.REMOVE_PLAYER_BOMBS,
  			id
  		})

  		const newState = testingStore.getState()
  		expect(newState.allBombs).to.deep.equal({})
  	})
  })

})

