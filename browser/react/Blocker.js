import React, { Component } from 'react';
import { controls } from '../game/main';

class Blocker extends Component {
  constructor(props) {
    super(props)

    this.state = {
      instructions: true
    }

    this.handleClick = this.handleClick.bind(this)
  }

  componentDidMount() {
    const element = document.body;
    const blocker = this.refs.blocker;
    const instructions = this.refs.instructions;

    const pointerlockchange = ( event ) => {
        if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
            controls.enabled = true;
            blocker.style.display = 'none';
        } else { // this is where we get the exit screen
            controls.enabled = false;
            blocker.style.display = '-webkit-box';
            blocker.style.display = '-moz-box';
            blocker.style.display = 'box';
            instructions.style.display = '';
            this.setState({ instructions: true })
        }
    }

    document.addEventListener( 'pointerlockchange', pointerlockchange, false );
  }

  handleClick(evt) {
    const element = document.body

    // Ask browser to lock pointer
    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

    element.requestPointerLock();
    this.setState({ instructions: false })
  }

  render() {
    return (
      <div id="blocker" ref="blocker">
       { this.state.instructions && <div id="instructions" ref="instructions" onClick={this.handleClick}>
          <span style={{ display: 'inline-block', marginBottom: '50px', fontSize: '40px', zIndex: '999'}}>Click to play</span>
          <br />
          <span style={{ fontSize: '18px' }}>(W,A,S,D = Move, MOUSE = Look, CLICK = Plant Bomb, SPACE = Throw Bomb)</span>
          <br />
          <span style={{ fontSize: '18px' }}>(ENTER = Open Chat, ` = Close Chat, ESC = Instructions)</span>
        </div>}
      </div>
    )
  }
}

export default Blocker;
