import React from 'react';
import { connect } from 'react-redux';
import { getKillerNickname, getVictimNickname } from '../redux/announcer/reducer';

export const Announcer = (props) => {
  const { killerNickname, victimNickname } = props;

  return (
    <div>
      { killerNickname.length !== 0 && (killerNickname === victimNickname ?
      <h1 className='center' id='announcer'>{killerNickname} committed suicide.</h1> :
      <h1 className='center' id='announcer'>{killerNickname} killed {victimNickname}.</h1>) }
    </div>
  )
};

const mapStateToProps = (state) => ({
  killerNickname: getKillerNickname(state),
  victimNickname: getVictimNickname(state)
});

export default connect(mapStateToProps)(Announcer);
