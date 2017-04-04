import React, { Component } from 'react'
import store from '../redux/store';
import { connect } from 'react-redux';

export class Timer extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='timer'>
        {this.props.time ? ( minuteConvert(this.props.time)) : '' }
      </div>
    )
  }
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
