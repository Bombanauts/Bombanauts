import { expect } from 'chai'
import { createStore } from 'redux'
import { GENERATE_MAP, EXPLODE_BOX } from '../../server/maps/constants'
import { loadMap, updateMap } from '../../server/maps/action-creator'
import initialState from '../../server/maps/init-state'
import mapsReducer from '../../server/maps/reducer'
import { map } from '../../server/maps/map'

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