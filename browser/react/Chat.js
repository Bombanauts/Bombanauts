import React, { Component } from 'react';
import TextField from 'material-ui/TextField'

export default class Chat extends Component {
  constructor(props) {
    super(props)

    this.state = {
      message: ''
    }

    this.submitMessage = this.submitMessage.bind(this)
    this.handleMessageChange = this.handleMessageChange.bind(this)
    this.closeChat = this.closeChat.bind(this)
    this.openChat = this.openChat.bind(this)
  }

  submitMessage(evt) {
    if (evt.keyCode === 13) {
      // socket emit something here
      socket.emit('new_message', this.state.message)
      this.setState({ message: '' })
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
    return (
      <div>
        <TextField
          onChange={this.handleMessageChange}
          onKeyDown={this.submitMessage}
          value={this.state.message}
          />
      </div>
    )
  }
}
