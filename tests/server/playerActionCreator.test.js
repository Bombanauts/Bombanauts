import { expect } from 'chai';
import {
  GET_PLAYERS,
  UPDATE_PLAYERS,
  REMOVE_PLAYER,
  KILL_PLAYER,
  SET_NICKNAME
} from '../../server/players/constants';
import {
  getPlayers,
  updatePlayers,
  removePlayer,
  killPlayer,
  setNickname
} from '../../server/players/action-creator';

describe('Back end player action creators', () => {

  describe('getPlayers function', () => {
    it('should return an object with type and room ID', () => {
      expect(getPlayers(2)).to.deep.equal({ type: GET_PLAYERS, roomId: 2 })
    })
  })

  describe('updatePlayers function', () => {
    it('should return an object with players, room ID, and type', () => {
      expect(updatePlayers('player1', 2, 'sam')).to.deep.equal({ type: UPDATE_PLAYERS, player: 'player1', roomId: 2, nickname: 'sam' })
    })
  })

  describe('removePlayer function', () => {
    it('should return an object with ID, room ID and type', () => {
      expect(removePlayer(1, 2)).to.deep.equal({ type: REMOVE_PLAYER, id: 1, roomId: 2 })
    })
  })

  describe('killPlayer function', () => {
    it('should return an object with ID, room ID, and type', () => {
      expect(killPlayer(1, 2)).to.deep.equal({ type: KILL_PLAYER, id: 1, roomId: 2 })
    })
  })

  describe('setNickname function', () => {
    it('should return an object with type, ID, nickname, and room ID', () => {
      expect(setNickname(1, 'sam', 2)).to.deep.equal({ type: SET_NICKNAME, id: 1, nickname: 'sam', roomId: 2 })
    })
  })
})
