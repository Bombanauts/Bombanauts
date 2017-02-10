import React from 'react';
import socket from '../socket';
import store from '../redux/store';
import { Scores } from './Scores';

const WinCondition = (props) => {
  let winnerId = props.winner

  const players = store.getState().players
  let winnerNickname = '';
  if (socket.id === winnerId && winnerId) {
      winnerNickname = 'You'
      socket.emit('reset_world', {})
  } else if (winnerId) {
    winnerNickname = players[winnerId].nickname;
  }

  return (
    <h1 style={{position: "absolute", right: 500}}>{winnerNickname} Won!</h1>
  )
}

export default WinCondition;
