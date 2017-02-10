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
import Chat from './Chat';
import WinCondition from './WinCondition';

const fontStyle = {
  'fontSize': '40px'
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      time: 0
    }
  }

  componentDidMount() {
    delay(300)
    .then(() => {
      initCannon()
      init()
      animate()
    })
  }

  render() {
    return (
      <div>
          <Chat />
          <Announcer  />
          {!this.props.isPlaying && <Splash />}
          { this.props.winner && <WinCondition winner={this.props.winner} /> }
          <Blocker dead={this.props.dead} />
          { this.props.dead && <div style={{ backgroundColor: '#700303',
            position: 'absolute',
            opacity: '0.7',
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none'}}>
              <span style={{
              fontSize: 50,
              margin: 'auto',
              textAlign: 'center',
              position: 'relative',
              display: 'table',
              top: 60}}>YOU DIED!</span>
            </div>
          }
          <Timer />
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
