import { expect } from 'chai'
import { createStore } from 'redux'
import { SET_TIME, GET_TIME } from '../../server/redux/timer/constants'
import { setTime, getTime } from '../../server/redux/timer/action-creator'
import initialState from '../../server/redux/timer/init-state'

describe('Back end timer action creators', () => {
  const roomId = 'Earth'
  const time = Date.now();

  describe('SET_TIME', () => {
    it('returns an object with the SET_TIME type', () => {
      expect(setTime(time, roomId).type).to.equal('SET_TIME')
    })

    it('returns an object with the time and room IDs under their respective properties', () => {
      expect(setTime(time, roomId).time).to.equal(time)
      expect(setTime(time, roomId).roomId).to.equal('Earth')
    })
  })

  describe('GET_TIME', () => {
    it('returns an object with the GET_TIME type', () => {
      expect(getTime(roomId).type).to.equal('GET_TIME')
    })

    it('returns an object with the Room ID under it\'s room ID property', () => {
      expect(getTime(roomId).roomId).to.equal('Earth')
    })
  })
})
