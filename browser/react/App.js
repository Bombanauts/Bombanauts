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
    let winnerId = this.props.winner

    const players = store.getState().players
    let winnerNickname = '';
    if (socket.id === winnerId && winnerId) {
        winnerNickname = 'You'
        socket.emit('reset_world', {})
    } else if (winnerId) {
      winnerNickname = players[winnerId].nickname;
    }

    return (
      <div>
          {this.props.isPlaying && <Chat />}
          <Announcer  />
          {!this.props.isPlaying && <Splash />}
          { winnerId &&
            (<div>
               <h1  style={{position: "absolute", right: 500}}>{winnerNickname} Won!</h1>
               <Scores />
             </div>
            )
          }
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
