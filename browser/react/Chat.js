import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import { connect } from 'react-redux';
import { startChat, stopChat } from '../chat/action-creator';
import socket from '../socket';

class Chat extends Component {
  constructor(props) {
    super(props)

    this.state = {
      message: '',
      open: false
    }

    this.submitMessage = this.submitMessage.bind(this)
    this.handleMessageChange = this.handleMessageChange.bind(this)
    this.closeChat = this.closeChat.bind(this)
    this.openChat = this.openChat.bind(this)
  }

  componentDidMount() {
    // enable chat start/close on enter key press
    window.addEventListener('keydown', (evt) => {
      // enter to start chat
      if (evt.keyCode === 13) this.props.startChat()

      // back tick to stop chat
      if (evt.keyCode === 192) this.props.stopChat()
    }, false)
  }

  componentDidUpdate() {
    // set focus to chat box
    if (this.props.isChatting) this.refs.chat.focus()
  }


  submitMessage(evt) {
    if (evt.keyCode === 13) {
      socket.emit('new_message', this.state.message)
      this.setState({ message: '' })
      this.props.stopChat()
    }
  }

  handleMessageChange(evt) {
    this.setState({ message: evt.target.value })
  }

  closeChat() {
    this.setState({ open: false })
  }

  openChat() {
    this.setState({ open: true })
  }

  render() {
    if (this.props.isChatting) {
      return (
        <div>
          <div>
          </div>
          <TextField
            id="chat"
            ref="chat"
            onChange={this.handleMessageChange}
            onKeyDown={this.submitMessage}
            value={this.state.message}
            />
        </div>
      )
    } else {
      return (
        <h1>CHAT IS CLOSED NOW</h1>
      )
    }
  }
}

const mapStateToProps = (state) => ({
  isChatting: state.isChatting,
  isPlaying: state.isPlaying
})

const mapDispatchToProps = (dispatch) => ({
  startChat: () => dispatch(startChat()),
  stopChat: () => dispatch(stopChat())
})

export default connect(mapStateToProps, mapDispatchToProps)(Chat)
