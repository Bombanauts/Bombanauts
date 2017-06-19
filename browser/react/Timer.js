import React from 'react';
import { connect } from 'react-redux';

import { getCurrentTime } from '../redux/timer/reducer';
import { getIsPlaying } from '../redux/gameState/reducer';

export const Timer = props => {
  return (
    <div className='timer'>
      {props.time ? (minuteConvert(props.time)) : '' }
    </div>
  )
}

const mapStateToProps = (state) => ({
  time: getCurrentTime(state),
  isPlaying: getIsPlaying(state)
});

const minuteConvert = (num) => {
  let minutes = Math.floor(num / 60) || 0;
  minutes = minutes.toString();
  let seconds = Math.floor(num - minutes * 60);

  if (seconds < 10) { seconds = '0' + seconds.toString(); }
  else { seconds = seconds.toString(); }

  return `${minutes}:${seconds}`;
}

export default connect(mapStateToProps)(Timer);
