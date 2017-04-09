import React, { Component } from 'react';
import { controls } from '../game/main';
import MuteButton from './MuteButton';

class Blocker extends Component {
  constructor(props) {
    super(props);
    this.state = { instructions: true };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    const element = document.body;
    const blocker = this.refs.blocker;
    const instructions = this.refs.instructions;

    const pointerlockchange = (event) => {
      if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
        controls.enabled = true;
        blocker.style.display = 'none';
      } else { // EXIT SCREEN
        controls.enabled = false;
        blocker.style.display = '-webkit-box';
        blocker.style.display = '-moz-box';
        blocker.style.display = 'box';
        instructions.style.display = '';
        this.setState({ instructions: true });
      }
    }

    document.addEventListener('pointerlockchange', pointerlockchange, false);
  }

  handleClick(evt) {
    const element = document.body;

    /*----- ASKS BROWSER TO LOCK POINTER -----*/
    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

    element.requestPointerLock();
    this.setState({ instructions: false });
  }

  render() {
    return (
      <div id="blocker" ref="blocker">
        { this.state.instructions &&
          <div id="instructions" ref="instructions" onClick={this.handleClick}>
            <span className='blocker-title'>Click to play</span>
            <br />
            <span className='blocker-instruction-controls'>(W,A,S,D = Move, MOUSE = Look, CLICK = Plant Bomb, SPACE = Throw Bomb)</span>
            <br />
            <span className='blocker-instruction-controls'>(ENTER = Open Chat, ` = Close Chat, ESC = Instructions)</span>
            <br />
            <br />
            <br />
            <br />
            <br />

            <span className='blocker-instruction-controls'> Tips: </span>
            <br />
              <span className='blocker-instruction-tips'>Wooden crates can be broken with bombs to navigate the map.</span>
              <br />
              <br />
              <span className='blocker-instruction-tips'>You cannot throw bombs over blocks or crates.</span>
              <br />
              <br />
              <span className='blocker-instruction-tips'>You can throw your bombs at other players' bombs to move them.</span>
              <br />
              <br />
              <span className='blocker-instruction-tips'>Be careful not to kill yourself!</span>
            <br />
          </div>}
        <MuteButton />
      </div>
    )
  }
}

export default Blocker;
