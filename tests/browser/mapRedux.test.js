import { createStore } from 'redux'
import { expect } from 'chai'
import { loadMap } from '../../browser/redux/maps/action-creator'
import { map } from '../../browser/redux/maps/reducer'
import * as types from '../../browser/redux/maps/constants'

describe('Front end map action creator', () => {
  describe('GENERATE_MAP', () => {
    it('returns expected action description', () => {
			let map = [ // 1  2  3  4  5  6  7  8  9  10 11 12
		    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // 0
		    [1, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 1], // 1
		    [1, 0, 2, 3, 2, 3, 2, 3, 2, 3, 2, 0, 1], // 2
		    [1, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 1], // 3
		    [1, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 1], // 4
		    [1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1], // 5
		    [1, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 1], // 6
		    [1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1], // 7
		    [1, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 1], // 8
		    [1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1], // 9
		    [1, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 1], // 10
		    [1, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 1], // 11
		    [1, 0, 2, 3, 2, 3, 2, 3, 2, 3, 2, 0, 1], // 12
		    [1, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 1], // 13
		    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // 14
		 	]

      const expectedAction = {
        type: types.GENERATE_MAP,
       	map
      }

      expect(loadMap(map)).to.be.deep.equal(expectedAction)
    })
  })
})

describe('Front end map reducer', () => {
  let testStore;
  beforeEach('Create testing store from reducer', () => {
    testStore = createStore(map);
  })

  it('has an initial state of an empty object', () => {
    expect(testStore.getState()).to.be.deep.equal({});
  })

  describe('GENERATE_MAP', () => {
    it('creates a new map when a game is initialized', () => {
      const map = [
		    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		    [1, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 1],
		    [1, 0, 2, 3, 2, 3, 2, 3, 2, 3, 2, 0, 1],
		    [1, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 1],
		    [1, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 1],
		    [1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1],
		    [1, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 1],
		    [1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1],
		    [1, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 1],
		    [1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1],
		    [1, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 1],
		    [1, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 1],
		    [1, 0, 2, 3, 2, 3, 2, 3, 2, 3, 2, 0, 1],
		    [1, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 1],
		    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
		 	]
      testStore.dispatch({
        type: types.GENERATE_MAP,
       	map
      })
      console.log(testStore.getState())
      expect(testStore.getState()).to.be.deep.equal(map)
    })

    it('creates a NEW state object on any dispatched action', () => {
      const firstState = testStore.getState()
      testStore.dispatch({
        type: types.GENERATE_MAP,
        map
      })
      expect(testStore.getState()).to.not.be.equal(firstState)
    })
  })
})