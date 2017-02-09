const { expect } = require('chai')
const { START_CHAT, STOP_CHAT } = require('../../browser/chat/constants')
const { startChat, stopChat } = require('../../browser/chat/action-creator')

describe('Chat System action creators', () => {
  describe('startChat action creator', () => {
    it('should return an object with a type property of START_CHAT', () => {
      expect(startChat()).to.deep.equal({
        type: START_CHAT
      })
    })
  })

  describe('stopChat action creator', () => {
    it('should return an object with a type property of STOP_CHAT', () => {
      expect(stopChat()).to.deep.equal({
        type: STOP_CHAT
      })
    })
  })
})
