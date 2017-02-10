import React, { Component } from 'react';
import store from '../redux/store';
import { connect } from 'react-redux';

export class Announcer extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    let killerName;
    let victimName;
    if (this.props.killer) {
      killerName = this.props.killer.nickname
      victimName = this.props.victim.nickname
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
  }
}


const mapStateToProps = (state) => {
  return {
    killer: state.announcement.killer,
    victim: state.announcement.victim
  }
}

export default connect(mapStateToProps)(Announcer);
