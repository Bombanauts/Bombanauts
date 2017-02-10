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
        <div>
          <h1 id='title'>BomberJS</h1>
          <div id='name'>
            <TextField
                  id="nickname"
                  onChange={this.updateNickname}
                  // onKeyDown={this.handleEnterKey}
                  maxLength={15}
                  hintText="Nickname"
                  floatingLabelText="Nickname"
                  floatingLabelStyle={{ color: '#cc2d2d' }}
                  underlineFocusStyle={{ borderColor: '#cc2d2d'}}
                  inputStyle={{ color: '#D5D1D0' }}
                  />
            <RaisedButton
                  disabled={!this.state.nickname}
                  onClick={this.setNickname}
                  backgroundColor="#cc2d2d"
                  disabledBackgroundColor='#cc2d2d'
                  label='Play'
                  style={{ display: 'block', 'color': '#D5D1D0' }}
                   />
          </div>
          <img id='bomberman' src='/images/bomberman.gif'></img>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  start: () => dispatch(startGame())
})

export default connect(null, mapDispatchToProps)(Splash)
