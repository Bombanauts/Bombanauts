import React, { Component } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import { muteSound, unmuteSound } from '../redux/sound/action-creator';

const MuteButton = (props) => {
  return (
    <RaisedButton
          label={props.sound ? 'MUTE' : 'UNMUTE' }
          style={{ position: 'absolute', left: '5%', bottom: '5%' }}
          onClick={() => props.sound ? props.muteSound() : props.unmuteSound()}
          />
  )
}

const mapStateToProps = (state) => ({
  sound: state.sound
})

const mapDispatchToProps = (dispatch) => ({
  muteSound: () => dispatch(muteSound()),
  unmuteSound: () => dispatch(unmuteSound())
})

export default connect(mapStateToProps, mapDispatchToProps)(MuteButton)

