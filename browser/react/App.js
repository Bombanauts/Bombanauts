import React, {Component} from 'react'
import ReactCountdownClock from 'react-countdown-clock';
import { connect } from 'react-redux';
import store from '../store';
import { initCannon, init, animate, controls } from '../game/main';

const fontStyle = {
  'fontSize': '40px'
}

function delay(t) {
  return new Promise(resolve => {
    setTimeout(resolve, t)
  })
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      time: 0,
      instructions: true,
    }

    this.handleClick = this.handleClick.bind(this)
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

  handleClick(evt) {
    evt.stopPropagation()

    const element = document.body

    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

    element.requestPointerLock();

    controls.enabled = true;
    this.setState({instructions: false})
  }

  render() {
    return (
      <div>
        { this.state.instructions && <div id="blocker" >
          <div id="instructions" onClick={this.handleClick}>
            <span style={fontStyle}>Click to play</span>
            <br />
            (W,A,S,D = Move, SPACE = Jump, MOUSE = Look, CLICK = Shoot)
          </div>
        </div> }
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

const mapStateToProps = (state) => state.dead

export default connect(mapStateToProps)(App);
