import React, { Component } from 'react';
import { connect } from 'redux';

class Splash extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div style={{ backgroundColor: 'white' }}>
        <h1 style={{
              fontSize: 50,
              position: 'absolute',
              right: 500,
              top: 50,
            }}>BomberJS</h1>
      </div>
    )
  }
}

export default Splash
