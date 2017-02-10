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

  // describe('REMOVE_PLAYER_BOMBS', () => {
  //   it('removes the specified player\'s bombs', () => {
  //     const id = 'UidDcC7s6X6QrYr2AAAB'
  //     const bomb = {
  //       [id]: [{ position: { x: 1, y: 1, z: 1 } }]
  //     }

  //     testStore.dispatch({
  //       type: types.UPDATE_BOMB_LOCATIONS,
  //       allBombs: bomb
  //     })
  //     testStore.dispatch({
  //       type: types.REMOVE_PLAYER_BOMBS,
  //       id
  //     })

  //     expect(testStore.getState()).to.be.deep.equal({})
  //   })

  //   it('does not remove other player\'s bombs', () => {
  //     const id = 'UidDcC7s6X6QrYr2AAAB'
  //     const idB = 'lndasklasnd'
  //     const bomb = {
  //       [id]: [{ position: { x: 1, y: 1, z: 1 } }]
  //     }
  //     const bombB = {
  //       [idB]: [{ position: { x: 1, y: 1, z: 1 } }]
  //     }

  //     testStore.dispatch({
  //       type: types.UPDATE_BOMB_LOCATIONS,
  //       allBombs: bomb
  //     })
  //     testStore.dispatch({
  //       type: types.UPDATE_BOMB_LOCATIONS,
  //       allBombs: bombB
  //     })
  //     testStore.dispatch({
  //       type: types.REMOVE_PLAYER_BOMBS,
  //       id: idB
  //     })

  //     expect(testStore.getState()).to.be.deep.equal(bomb)
  //   })
  // })

})