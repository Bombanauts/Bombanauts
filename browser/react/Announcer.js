import React from 'react';
import { connect } from 'react-redux';

export const Announcer = (props) => {
  let killerName;
  let victimName;
  if (props.killer) {
    killerName = props.killer.nickname;
    victimName = props.victim.nickname;
  }

  if (killerName !== undefined && killerName !== '') {
    return (
      <div>
      { killerName === victimName ?
        <h1 className='center' id='announcer'>{killerName} committed suicide.</h1> :
        <h1 className='center' id='announcer'>{killerName} killed {victimName}.</h1> }
      </div>
    )
  }
  else {
    return (
      <div></div>
    )
  }
};


const mapStateToProps = (state) => ({
  killer: state.announcement.killer,
  victim: state.announcement.victim
});

export default connect(mapStateToProps)(Announcer);
