import React, {Component} from 'react'
import ReactCountdownClock from 'react-countdown-clock';
import { connect } from 'react-redux';
import store from '../store';
import { initCannon, init, animate } from '../game/main';
import Blocker from './Blocker';

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
          <Blocker />
          {this.props.dead && <h1  style={{position: "absolute", right: 300}}> YOU ARE FUCKING DEAD</h1>}
            <div style={{position: "absolute", right: 0}}>
             { this.state.time !== 0 &&
              <ReactCountdownClock
            seconds={+this.state.time}
            color="#ddd"
            alpha={0.5}
            size={100}
            timeFormat="hms"
            // onComplete={}
            />
            }
          </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
    dead: state.dead,
    winner: state.winner
})


export default connect(mapStateToProps)(App);
