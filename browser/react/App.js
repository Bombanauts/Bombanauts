import React, {Component} from 'react'
import ReactCountdownClock from 'react-countdown-clock';
import { connect } from 'react-redux';
import socket from '../socket';
import store from '../redux/store';
import Timer from './Timer';

import { initCannon, init, animate, controls } from '../game/main';

import { delay } from '../game/utils';

import Blocker from './Blocker';
import Splash from './Splash';
import Announcer from './Announcer';
import { Scores } from './Scores';
import Chat from './Chat';
import Winner from './Winner';
import Dead from './Dead';

const fontStyle = {
  'fontSize': '40px'
}

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
    return (
      <div>
          {this.props.isPlaying && <Chat />}
          {this.props.isPlaying && <Announcer />}
          {!this.props.isPlaying && <Splash />}
          {this.props.winner && <Winner />}
          <Blocker dead={this.props.dead} />
          { this.props.dead && <Dead /> }
          { this.props.isPlaying && !this.props.winner && <Timer /> }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    dead: state.dead,
    winner: state.winner,
    isPlaying: state.isPlaying
  }
}

export default connect(mapStateToProps)(App);
