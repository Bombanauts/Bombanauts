import React, { Component } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';

import socket from '../socket';
import MuteButton, { styles } from './MuteButton';
import { startGame } from '../redux/gameState/action-creator';

const splashStyles = {
  colorGray: {
    color: '#D5D1D0'
  },
  colorRed: {
    color: '#CC2D2D'
  },
  borderColor: {
    borderColor: '#CC2D2D'
  },
  buttonStyle: {
    display: 'block',
    borderColor: 'none'
  }
}

class Splash extends Component {
  constructor(props) {
    super(props);
    this.state = { nickname: '' };

    this.updateNickname = this.updateNickname.bind(this);
    this.setNickname = this.setNickname.bind(this);
    // this.handleEnterKey = this.handleEnterKey.bind(this)
  }

  updateNickname(event) {
    this.setState({ nickname: event.target.value });
  }

  setNickname() {
    socket.emit('set_nickname', this.state.nickname);
    this.props.startGame();
  }

  // press enter to set nickname
  // handleEnterKey(evt) {
  //   if (evt.keyCode === 13) this.setNickname()
  // }

  render() {
    return (
      <div id='backgroundimage'>
          <div id="name" className="center">
            <h1 id="title">Bombanauts</h1>
            <div id="nickname-form">
              <TextField
                id="nickname"
                onChange={this.updateNickname}
                // onKeyDown={this.handleEnterKey}
                maxLength={15}
                hintText="Nickname"
                hintStyle={splashStyles.colorGray}
                floatingLabelText="Nickname"
                floatingLabelStyle={splashStyles.colorRed}
                underlineFocusStyle={splashStyles.borderColor}
                inputStyle={splashStyles.colorGray}
              />
              <RaisedButton
                disabled={!this.state.nickname}
                onClick={this.setNickname}
                backgroundColor={splashStyles.colorRed.color}
                disabledBackgroundColor={splashStyles.colorGray.color}
                label="Play"
                style={splashStyles.buttonStyle}
              />
            </div>
          </div>
          <MuteButton />
          <IconButton
            href="https://github.com/Bombanauts/Bombanauts"
            target="_blank"
            disableTouchRipple={true}
            iconClassName="material-icons"
            className="git"
            iconStyle={styles.largeIcon}
            hoveredStyle={splashStyles.colorRed}
            style={styles.large}>
            code
          </IconButton>
          <img id="bomberman" src="/images/bomberman.gif"></img>
      </div>
    )
  }
}

const mapDispatchToProps = { startGame };

export default connect(null, mapDispatchToProps)(Splash);
