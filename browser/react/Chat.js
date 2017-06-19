import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import { connect } from 'react-redux';
import { startChat, stopChat } from '../redux/chat/action-creator';
import socket from '../socket';
import { controls } from '../game/main';
import { getIsChatting, getLastFiveMessages } from '../redux/chat/reducer';
import { getIsPlaying } from '../redux/gameState/reducer';

const styles = {
  borderStyles: {
    borderColor: '#ffffff'
  },
  fontStyles: {
    ontSize: 15,
    color: '#ffffff'
  }
}

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
    const { handleMessageChange, submitMessage } = this;
    const { lastFiveMessages, isChatting } = this.props;
    const { message } = this.state;

    const chatMessages = lastFiveMessages.map((chatMessage, idx) => {
      return (<h1 key={`${idx}`} className='chat-message'>{chatMessage}</h1>)
    })

    return (
      <div className='chat-box'>
        {chatMessages}
        {isChatting ?
        <TextField
          id="chat"
          ref="chat"
          onChange={handleMessageChange}
          onKeyDown={submitMessage}
          value={message}
          underlineFocusStyle={styles.borderStyles}
          inputStyle={styles.fontStyles}
        /> : <h1 className='chat-message'>Press Enter to Chat / Back Tick to Exit Chat</h1>}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  isChatting: getIsChatting(state),
  isPlaying: getIsPlaying(state),
  lastFiveMessages: getLastFiveMessages(state)
});

const mapDispatchToProps = { startChat, stopChat };

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
