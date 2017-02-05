const { expect } = require('chai')
const { KILL_PLAYER, killPlayer } = require('../../../browser/game/action-creator')

describe('killPlayer action creator', () => {
  it('should return an object with type KILL_PLAYER', () => {
    expect(killPlayer()).to.deep.equal({
      type: KILL_PLAYER
    })
  })
})
