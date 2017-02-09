import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import { connect } from 'react-redux';

class Chat extends Component {
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
    console.log('PROPS INSIDE CHAT', this.props)
    if (this.props.isChatting) {
      return (
        <div>
          <div>
          </div>
          <TextField
            onChange={this.handleMessageChange}
            onKeyDown={this.submitMessage}
            value={this.state.message}
            />
        </div>
      )
    } else {
      return (
        <div></div>
      )
    }
  }
}

const mapStateToProps = (state) => ({
  isChatting: state.isChatting,
  isPlaying: state.isPlaying
})

const mapDispatchToProps = (dispatch) => {}

export default connect(mapStateToProps, mapDispatchToProps)(Chat)
