import { createStore } from 'redux';
import { expect } from 'chai';
import { KILL_PLAYER, REVIVE_PLAYER } from '../../browser/redux/dead/constants';
import { killPlayer, revivePlayer } from '../../browser/redux/dead/action-creator';
import { dead } from '../../browser/redux/dead/reducer';

describe('Front end dead action creator', () => {
  describe('killPlayer', () => {
    it('returns expected action description', () => {
      const expectedAction = { type: KILL_PLAYER };
      expect(killPlayer()).to.be.deep.equal(expectedAction);
    });
  });

  describe('revivePlayer', () => {
    it('returns expected action description', () => {
      const expectedAction = { type: REVIVE_PLAYER };
      expect(revivePlayer()).to.be.deep.equal(expectedAction);
    });
  });
});

describe('Front end dead reducer', () => {
  let testStore;
  beforeEach('Create testing store from reducer', () => {
    testStore = createStore(dead);
  });

  it('has an initial state of an false', () => {
    expect(testStore.getState()).to.be.deep.equal(false);
  });

  describe('KILL_PLAYER', () => {
    it('sets player death to true', () => {
      testStore.dispatch({ type: KILL_PLAYER });
      expect(testStore.getState()).to.be.deep.equal(true);
    });
  });

  describe('REVIVE_PLAYER', () => {
    it('sets player death to false', () => {
      testStore.dispatch({ type: REVIVE_PLAYER });
      expect(testStore.getState()).to.be.deep.equal(false);
    });
  });
});
