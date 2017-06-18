import React from 'react';
import socket from '../socket';
import Scores from './Scores';
import store from '../redux/store';

const Winner = (props) => {
  const winnerId = props.winner;
  const players = store.getState().players;
  let winnerNickname;

  if (socket.id === winnerId && winnerId) {
    winnerNickname = 'You win!';
    socket.emit('reset_world', {});
  } else if (winnerId) {
    winnerNickname = players[winnerId].nickname + ' wins!';
  }

  return (
    <div>
      <h1 id='winner' className='center'>{winnerNickname}</h1>
      <Scores />
    </div>
  )
}

export default Winner;
