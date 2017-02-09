import React, { Component } from 'react';
import { connect } from 'react-redux';
import socket from '../socket';
import { startGame } from '../redux/gameState/action-creator';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField'

class Splash extends Component {
  constructor(props) {
    super(props)

    this.state = {
      nickname: ''
    }
    this.updateNickname = this.updateNickname.bind(this)
    this.setNickname = this.setNickname.bind(this)
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
                  onChange={this.updateNickname}
                  maxLength={15}
                  hintText="nickname"
                  floatingLabelText="nickname"
                  floatingLabelStyle={{ color: '#00B303' }}
                  underlineFocusStyle={{ borderColor: '#00B303'}}
                  />
            <RaisedButton
                  backgroundColor="#00B303"
                  onClick={this.setNickname}
                  disabled={!this.state.nickname}
                  label='Play'
                  style={{ display: 'block' }}
                   />
          </span>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  start: () => dispatch(startGame())
})

export default connect(null, mapDispatchToProps)(Splash)
