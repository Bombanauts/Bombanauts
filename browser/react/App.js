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
    this.state = {
      time: 0
    }
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
    let winnerId = this.props.winner

    const players = store.getState().players
    let winnerNickname = '';
    if (socket.id === winnerId && winnerId) {
        winnerNickname = 'You win!'
        socket.emit('reset_world', {})
    } else if (winnerId) {
      winnerNickname = players[winnerId].nickname + ' wins!';
    }
// { this.props.winner && <Winner winner={this.props.winner} />}
    return (
      <div>
          {this.props.isPlaying && <Chat />}
          {this.props.isPlaying && <Announcer />}
          {!this.props.isPlaying && <Splash />}
{this.props.winner && (
    <div>
      <h1 id='winner' className='center'>{winnerNickname}</h1>
      <Scores />
     </div>
  )}

          <Blocker dead={this.props.dead} />
          { this.props.dead && <Dead /> }
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
