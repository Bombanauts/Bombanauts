import React, { Component } from 'react';
import { connect } from 'react-redux';
import socket from '../socket';
import { startGame } from '../redux/gameState/action-creator';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { muteSound, unmuteSound } from '../redux/sound/action-creator';
import FloatingActionButton from 'material-ui/FloatingActionButton';

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
      <div style={{ backgroundImage: 'url("images/splash.png")', backgroundSize: 'cover', height: '100%', width: '100%' }}>
        <div>
          <span style={{
              fontSize: 50,
              margin: 'auto',
              textAlign: 'center',
              position: 'relative',
              display: 'table',
              top: 80
            }}>BomberJS</span>
          <span style={{
              margin: 'auto',
              textAlign: 'center',
              position: 'relative',
              display: 'table',
              top: 80
            }}>
            <TextField
                  id="nickname"
                  onChange={this.updateNickname}
                  // onKeyDown={this.handleEnterKey}
                  maxLength={15}
                  hintText="nickname"
                  floatingLabelText="nickname"
                  floatingLabelStyle={{ color: '#00B303' }}
                  underlineFocusStyle={{ borderColor: '#00B303'}}
                  />
            <RaisedButton
                  disabled={!this.state.nickname}
                  onClick={this.setNickname}
                  backgroundColor="#00B303"
                  label='Play'
                  style={{ display: 'block' }}
                   />
          </span>
        </div>
        <RaisedButton
            label={this.props.sound ? 'MUTE' : 'UNMUTE' }
            style={{ position: 'absolute', left: '5%', bottom: '5%' }}
            onClick={() => this.props.sound ? this.props.muteSound() : this.props.unmuteSound()}
            />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  sound: state.sound
})

const mapDispatchToProps = (dispatch) => ({
  start: () => dispatch(startGame()),
  muteSound: () => dispatch(muteSound()),
  unmuteSound: () => dispatch(unmuteSound())
})

export default connect(mapStateToProps, mapDispatchToProps)(Splash)
