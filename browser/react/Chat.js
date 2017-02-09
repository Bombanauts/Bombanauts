import React, { Component } from 'react';

export default class Chat extends Component {
  constructor(props) {
    super(props)

    this.state = {
      message: ''
    }

    this.submitMessage = this.submitMessage.bind(this)
  }

  submitMessage() {
    // socket emit something here
    this.setState({ message: '' })
  }

  handleMessageChange(evt) {
    this.setState({ message: evt.target.value })
  }

  closeChat() {
    this.setState({ open: false })
  }

  render() {
    return (
      <div>
      </div>
    )
  }
}
