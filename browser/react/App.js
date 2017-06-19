import React, { Component } from 'react';
import { connect } from 'react-redux';

import { initCannon, init, animate } from '../game/main';
import { delay } from '../game/utils';

import Blocker from './Blocker';
import Splash from './Splash';
import Announcer from './Announcer';
import Chat from './Chat';
import Winner from './Winner';
import Dead from './Dead';
import Timer from './Timer';

import { getIsPlaying } from '../redux/gameState/reducer';
import { getWinner } from '../redux/winner/reducer';
import { getDeadStatus } from '../redux/dead/reducer';

class App extends Component {
  componentDidMount() {
    delay(500)
    .then(() => {
      initCannon();
      init();
      animate();
    });
  }

  render() {
    const { isPlaying, winner, dead } = this.props;

    return (
      <div>
        { isPlaying && <Chat /> }
        { isPlaying && <Announcer /> }
        { !isPlaying && <Splash /> }
        { winner && <Winner winner={winner} /> }
        <Blocker dead={dead} />
        { dead && <Dead /> }
        { isPlaying && !winner && <Timer /> }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  dead: getDeadStatus(state),
  winner: getWinner(state),
  isPlaying: getIsPlaying(state),
});

export default connect(mapStateToProps)(App);
