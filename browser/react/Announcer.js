import React, { Component } from 'react';
import store from '../store';
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
