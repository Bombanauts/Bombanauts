import React, { Component } from 'react'
import store from '../redux/store';
import { connect } from 'react-redux';

export const Timer = props => {
  return (
    <div className='timer'>
      {props.time ? ( minuteConvert(props.time)) : '' }
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    time: state.timer,
    isPlaying: state.isPlaying
  }
}


const minuteConvert = (num) => {
  let minutes = Math.floor(num / 60) || 0;
  minutes = minutes.toString()
  let seconds = Math.floor(num - minutes * 60);

  if (seconds < 10) {
    seconds = '0' + seconds.toString()
  } else {
    seconds = seconds.toString()
  }
  return `${minutes}:${seconds}`
}



export default connect(mapStateToProps)(Timer);
