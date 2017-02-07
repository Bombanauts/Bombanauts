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
      <div style={{ backgroundColor: 'white' }}>
        <h1 style={{
              fontSize: 50,
              position: 'absolute',
              right: 500,
              top: 50,
            }}>BomberJS</h1>
        <input  value={this.state.nickname}
                onChange={this.updateNickname}
                maxLength={15}
                type="text"
                placeholder="nickname"
                autoFocus/>
        <button className="Buttons"
                type="submit"
                onClick={this.setNickname}
                >play</button>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  start: () => dispatch(startGame())
})

export default connect(null, mapDispatchToProps)(Splash)
