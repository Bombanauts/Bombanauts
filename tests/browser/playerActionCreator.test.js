'use strict'

import { expect } from 'chai'
import { updatePlayerLocations, addPlayer, removePlayer } from '../../browser/redux/players/action-creator'
import { players } from '../../browser/redux/players/reducer'
import * as types from '../../browser/redux/players/constants'

describe('Fron end player action-creators', () => {
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

