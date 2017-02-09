import React, {Component} from 'react'
import store from '../store';
import { connect } from 'react-redux';

export class Timer extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div style={{position: "absolute", right: 0}}>
        {this.props.time ? Math.round(this.props.time) + '' : '' } Seconds Left
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    time: state.timer
  }
}

export default connect(mapStateToProps)(Timer);
