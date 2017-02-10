import React, { Component } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import { muteSound, unmuteSound } from '../redux/sound/action-creator';

class MuteButton extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <RaisedButton
            label={this.props.sound ? 'MUTE' : 'UNMUTE' }
            style={{ position: 'absolute', left: '5%', bottom: '5%' }}
            onClick={() => this.props.sound ? this.props.muteSound() : this.props.unmuteSound()}
            />
    )
  }
}

const mapStateToProps = (state) => ({
  sound: state.sound
})

const mapDispatchToProps = (dispatch) => ({
  muteSound: () => dispatch(muteSound()),
  unmuteSound: () => dispatch(unmuteSound())
})

export default connect(mapStateToProps, mapDispatchToProps)(MuteButton)

