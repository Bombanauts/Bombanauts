import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import { connect } from 'react-redux';
import { startChat, stopChat } from '../chat/action-creator';
import socket from '../socket';

class Chat extends Component {
  constructor(props) {
    super(props)

    this.state = {
      message: ''
    }

    this.submitMessage = this.submitMessage.bind(this)
    this.handleMessageChange = this.handleMessageChange.bind(this)
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

  render() {
    const lastFiveMessages = this.props.lastFiveMessages.map((message, idx) => {
        return (<h1 key={`${idx}`}>{message}</h1>)
    })

    return (
      <div style={{fontSize: 5,
                  position: 'absolute',
                  bottom: '5%',
                  marginLeft: '2%'}}>
        {lastFiveMessages}
         {this.props.isChatting && <TextField
          id="chat"
          ref="chat"
          onChange={this.handleMessageChange}
          onKeyDown={this.submitMessage}
          value={this.state.message}
          underlineFocusStyle={{ borderColor: '#000000'}}
          style={{ fontSize: 15 }}
          />}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  isChatting: state.chat.isChatting,
  isPlaying: state.isPlaying,
  lastFiveMessages: state.chat.lastFiveMessages
})

const mapDispatchToProps = (dispatch) => ({
  startChat: () => dispatch(startChat()),
  stopChat: () => dispatch(stopChat())
})

export default connect(mapStateToProps, mapDispatchToProps)(Chat)
