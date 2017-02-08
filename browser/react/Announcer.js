import React from 'react';

export const Announcer = ({ killerName, victimName }) => {
  return (
    <div>
    { killerName === victimName ?
      <h1 style={{
              fontSize: 50,
              margin: 'auto',
              textAlign: 'center',
              position: 'absolute',
              display: 'table',
              top: 50 }}>{killerName} Was Executed!!</h1> :
      <h1 style={{
              fontSize: 50,
              margin: 'auto',
              textAlign: 'center',
              position: 'absolute',
              display: 'table',
              top: 50 }}>{killerName} Has Slain {victimName}!!</h1> }
    </div>
  )
}
