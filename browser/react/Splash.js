import React, { Component } from 'react';
import { connect } from 'react-redux';
import socket from '../socket';
import { startGame } from '../redux/gameState/action-creator';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import MuteButton, { styles } from './MuteButton';
import IconButton from 'material-ui/IconButton';

class Splash extends Component {
  constructor(props) {
    super(props)

    this.state = {
      nickname: ''
    }
    this.updateNickname = this.updateNickname.bind(this)
    this.setNickname = this.setNickname.bind(this)
    // this.handleEnterKey = this.handleEnterKey.bind(this)
  }

  updateNickname(event) {
    this.setState({
      nickname: event.target.value
    })
  }

  setNickname() {
    socket.emit('set_nickname', this.state.nickname);
    this.props.start()
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
                  hintStyle={{color: '#D5D1D0'}}
                  floatingLabelText="Nickname"
                  floatingLabelStyle={{ color: '#cc2d2d' }}
                  underlineFocusStyle={{ borderColor: '#cc2d2d'}}
                  inputStyle={{ color: '#D5D1D0' }}
                  />
              <RaisedButton
                  disabled={!this.state.nickname}
                  onClick={this.setNickname}
                  backgroundColor="#cc2d2d"
                  disabledBackgroundColor='#D5D1D0'
                  label="Play"
                  style={{ display: 'block', borderColor: 'none'}}
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
            hoveredStyle={{color: "#cc2d2d"}}
            style={styles.large}>
            code
          </IconButton>
          <img id="bomberman" src="/images/bomberman.gif"></img>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  start: () => dispatch(startGame())
})

export default connect(null, mapDispatchToProps)(Splash)
