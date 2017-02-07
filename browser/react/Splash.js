import React, { Component } from 'react';
import { connect } from 'react-redux';
import socket from '../socket';
import { startGame } from '../gameState/action-creator';

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
    this.props.start()
    socket.emit('set_nickname', this.state.nickname);
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
              top: 140
            }}>
            <input value={this.state.nickname}
                  onChange={this.updateNickname}
                  maxLength={15}
                  type="text"
                  placeholder="nickname"
                  autoFocus
                  style={{
                    textAlign: 'center',
                    height: '30px'
                  }} />
          <button className="Buttons"
                  type="submit"
                  onClick={this.setNickname}
                  disabled={!this.state.nickname}
                  style={{
                    textAlign: 'center',
                    height: '30px'
                  }}>play</button>
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
