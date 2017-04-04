import React, {Component} from 'react'
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

class App extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    delay(500)
    .then(() => {
      initCannon()
      init()
      animate()
    })
  }

  render() {
    const isPlaying = this.props.isPlaying;
    const winner = this.props.winner;
    const dead = this.props.dead;

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

const mapStateToProps = (state) => {
  return {
    dead: state.dead,
    winner: state.winner,
    isPlaying: state.isPlaying,
  }
}

export default connect(mapStateToProps)(App);
