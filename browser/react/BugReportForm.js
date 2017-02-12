import React, { Component } from 'react';
import { connect } from 'redux';
import TextField from 'material-ui/TextField'

export default class BugReportForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      show: false,
      title: '',
      name: '',
      email: '',
      description: ''
    }

    this.updateTitle = this.updateTitle.bind(this);
    this.updateName = this.updateName.bind(this);
    this.updateEmail = this.updateEmail.bind(this);
    this.updateDescription = this.updateDescription.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.clearForm = this.clearForm.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  updateTitle(evt) {
    this.setState({ title: evt.target.value });
  }

  updateName(evt) {
    this.setState({ name: evt.target.value });
  }

  updateEmail(evt) {
    this.setState({ email: evt.target.value });
  }

  updateDescription(evt) {
    this.setState({ description: evt.target.value });
  }

  submitForm() { // ADD TO GITHUB ISSUES
    this.clearForm()
  }

  clearForm() {
    this.setState({
      title: '',
      name: '',
      email: '',
      description: ''
    })
  }

  handleButtonClick() {
    this.setState({ show: true })
  }

  render() {
    return (
      <div>
          <form onSubmit={this.submitForm}>
              <TextField name="name" label="Name" hintText="Name" floatingLabelText="Name" onChange={this.updateName} />

              <TextField name="email" label="Email" hintText="Email" floatingLabelText="Email" onChange={this.updateEmail} />

              <TextField name="description" label="Description" multiLine={true} rows={10} hintText="Description" floatingLabelText="Description" onChange={this.updateDescription} />
            <div>
              <button type="submit" onClick={this.submitForm}>Submit</button>
              <button type="button" onClick={this.clearForm}>Clear Values</button>
            </div>
          </form>
      </div>
    )
  }
}
