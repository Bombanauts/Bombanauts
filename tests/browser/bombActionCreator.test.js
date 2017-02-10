'use strict'

import { expect } from 'chai'

import { updateBombLocations, removePlayerBombs } from '../../browser/redux/bombs/action-creator'
import * as types from '../../browser/redux/bombs/constants'

describe('Front end bomb action creators', () => {
  describe('updateBombLocations', () => {
    it('returns expected action description', () => {
      const allBombs = {
        UidDcC7s6X6QrYr2AAAB: [{ position: { x: 1, y: 1, z: 1 } }]
      }
      const expectedAction = {
        type: types.UPDATE_BOMB_LOCATIONS,
        allBombs
      }

      expect(updateBombLocations(allBombs)).to.be.deep.equal(expectedAction)
    })
  })

  describe('removePlayerBombs', () => {
    it('returns expected action description', () => {
      const id = 'UidDcC7s6X6QrYr2AAAB'
      const expectedAction = {
        type: types.REMOVE_PLAYER_BOMBS,
        id
      }

      expect(removePlayerBombs(id)).to.be.deep.equal(expectedAction)
    })
  })
})

