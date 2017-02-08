import React from 'react';

export const Announcer = ({ killerName, victimName }) => {
  return (
    <div>
    { killerName === victimName ?
      <h1 style={{
              fontSize: 25,
              position: 'absolute',
              top: 120,
              marginLeft: '30%' }}>{killerName} Was Executed!!</h1> :
      <h1 style={{
              fontSize: 25,
              position: 'absolute',
              top: 120,
              marginLeft: '30%' }}>{killerName} Has Slain {victimName}!!</h1> }
    </div>
  )
}
