import React, {Component} from 'react'
import socket from '../socket';
import { nickname } from '../game/main.js';

export class Login extends Component {
  constructor(props) {
    super(props);
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
  }

  render() {
    return (
      <div>
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
