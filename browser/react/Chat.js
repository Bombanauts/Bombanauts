import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import { connect } from 'react-redux';
import { startChat, stopChat } from '../redux/chat/action-creator';
import socket from '../socket';
import { controls } from '../game/main';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = { message: '' };

    this.submitMessage = this.submitMessage.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
  }

  componentDidMount() {
    /*----- ENABLE CHAT START/CLOSE ON 'ENTER' -----*/
    window.addEventListener('keydown', (evt) => {

      //'ENTER' TO START
      if (evt.keyCode === 13) {
        this.props.startChat();
        controls.enabled = false;
      }

      // BACKTICK TO STOP
      if (evt.keyCode === 192) {
        this.props.stopChat();
        controls.enabled = true;
      }
    }, false)
  }

  componentDidUpdate() {
    /*----- SETS FOCUS TO CHAT BOX -----*/
    if (this.props.isChatting) { this.refs.chat.focus(); }
  }

  submitMessage(evt) {
    if (evt.keyCode === 13 && this.state.message.length > 0) {
      controls.enabled = true;
      socket.emit('new_message', {
        id: socket.id,
        message: this.state.message
      })
      this.setState({ message: '' });
      this.props.stopChat();
    }
  }

  handleMessageChange(evt) {
    this.setState({ message: evt.target.value });
  }

  render() {
    const lastFiveMessages = this.props.lastFiveMessages;
    const isChatting = this.props.isChatting;
    const handleMessageChange = this.handleMessageChange;
    const submitMessage = this.submitMessage;
    const message = this.state.message;

    const chatMessages = lastFiveMessages.map((chatMessage, idx) => {
      return (<h1 key={`${idx}`} style={{ fontSize: 15, color: '#ffffff' }}>{chatMessage}</h1>);
    })

    return (
      <div style={{ position: 'absolute', bottom: '5%', marginLeft: '2%' }}>
        {chatMessages}
        {isChatting ?
        <TextField
          id="chat"
          ref="chat"
          onChange={handleMessageChange}
          onKeyDown={submitMessage}
          value={message}
          underlineFocusStyle={{ borderColor: '#ffffff' }}
          inputStyle={{ fontSize: 15, color: '#ffffff' }}
        /> : <h1 style={{ fontSize: 15, color: '#ffffff' }}>Press Enter to Chat / Back Tick to Exit Chat</h1>}
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

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
