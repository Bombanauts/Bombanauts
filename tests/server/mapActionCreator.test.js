import { expect } from 'chai'
import { createStore } from 'redux'
import { GENERATE_MAP, EXPLODE_BOX } from '../../server/redux/maps/constants'
import { loadMap, updateMap } from '../../server/redux/maps/action-creator'
import initialState from '../../server/redux/maps/init-state'
import mapsReducer from '../../server/redux/maps/reducer'
import { map } from '../../server/redux/maps/map'

describe('Back end maps action creators', () => {
  const roomId = 'Earth'
  const coordinates = {
  	position: {
  		x: 1,
  		y: 2,
  		z: 3
  	}
  }

  describe('loadMap', () => {
    it('generates a map when function is invoked', () => {
      expect(loadMap(map, roomId).type).to.equal(GENERATE_MAP)
    })
  })

  describe('updateMap', () => {
    it('updates the map when boxes explode', () => {
      expect(updateMap(coordinates, roomId).type).to.equal(EXPLODE_BOX)
    })
  })
})
