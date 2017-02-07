import React, {Component} from 'react'
import ReactCountdownClock from 'react-countdown-clock';
import { connect } from 'react-redux';
import store from '../store';
import { initCannon, init, animate } from '../game/main';
import Blocker from './Blocker';
import Splash from './Splash';

function delay(t) {
  return new Promise(resolve => {
    setTimeout(resolve, t)
  })
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
      let timer = store.getState().timer;
      let now = Date.now();
      this.setState({
        time: (timer.endTime - now) / 1000
      })
    })
  }

  render() {
    return (
      <div>
          {!this.props.isPlaying && <Splash />}
          <Blocker dead={this.props.dead} />
          { this.props.dead && <div style={{ backgroundColor: '#700303',
            position: 'absolute',
            opacity: '0.7',
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none'}}><h1  style={{position: "absolute", right: 500}}> YOU ARE FUCKING DEAD</h1>
            </div>}
            <div style={{position: "absolute", right: 0}}>
             { this.state.time !== 0 &&
              <ReactCountdownClock
            seconds={+this.state.time}
            color="#ddd"
            alpha={0.5}
            size={100}
            timeFormat="hms"
            // onComplete={}
            /> }
          </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
    dead: state.dead,
    winner: state.winner,
    isPlaying: state.isPlaying,
})


export default connect(mapStateToProps)(App);
