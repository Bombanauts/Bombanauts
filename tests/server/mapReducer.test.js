import { expect } from 'chai'
import { createStore } from 'redux'
import { GENERATE_MAP, EXPLODE_BOX } from '../../server/redux/maps/constants'
import { loadMap, updateMap } from '../../server/redux/maps/action-creator'
import initialState from '../../server/redux/maps/init-state'
import mapsReducer from '../../server/redux/maps/reducer'
import { Maps, randomGeneration } from '../../server/redux/maps/map'

describe.only('back end maps reducer', () => {
  const roomId = 'Earth'
  const roomIdB = 'Wolf 1061b'
  let testStore;
  const randomMapA = randomGeneration(Maps)

  beforeEach('Create testing store', () => {
    testStore = createStore(mapsReducer);
  });

  it('has the expected initial state', () => {
    expect(testStore.getState()).to.be.deep.equal(initialState)
  })

  describe('GENERATE_MAP', () => {
    const randomMapB = randomGeneration(Maps)
    let firstMap;
    let secondMap;

    it('loads a map to the specified room on the state', () => {
      testStore.dispatch(loadMap(randomMapA, roomId))
      firstMap = testStore.getState()[roomId]

      expect(firstMap).to.be.a('array')
      expect(firstMap.length).to.equal(15)
    })

    it('loads randomly generated maps that are not the same', () => {
      testStore.dispatch(loadMap(randomMapB, roomId))
      secondMap = testStore.getState()[roomId]

      expect(firstMap).to.not.be.equal(secondMap)
    })
  })

  describe('EXPLODE_BOX', () => {
    const coordinates = {
      j: 6,
      k: 10
    }

    it('updates the state map accordingly when boxes explode', () => {
      testStore.dispatch(loadMap(randomMapA, roomId))
      testStore.dispatch(updateMap(coordinates, roomId))

      expect(testStore.getState()[roomId][6][10]).to.equal(0)
    })
  })

  describe('Separate rooms', () => {
    it('changes the state in the given room that was passed in by ID in the action creator', () => {
      testStore.dispatch(loadMap(randomMapA, roomId));

    })

    it('will update the one specified room while leaving others unchanged', () => {
      let mapA = testStore.getState()[roomId]

      expect(testStore.getState()[roomIdB]).to.be.deep.equal({})
      testStore.dispatch(loadMap(randomMapA, roomIdB))

      expect(testStore.getState()[roomId]).to.be.deep.equal(mapA)

      expect(testStore.getState()[roomIdB]).to.be.deep.equal(randomMapA)
    })
  })
})
