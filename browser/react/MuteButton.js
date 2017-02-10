import React from 'react';
import { connect } from 'react-redux';
import { muteSound, unmuteSound } from '../redux/sound/action-creator';
import IconButton from 'material-ui/IconButton';

const styles = {
  largeIcon: {
    width: 60,
    height: 60,
    fontSize: 60,
    color: '#fff'
  },
  large: {
    width: 120,
    height: 120,
    padding: 30,
  },
};

const MuteButton = (props) => {
  if (props.sound) {
    return (
      <div style={{ position: 'absolute', left: '1%', bottom: '1%'}}>
        <IconButton
          onClick={() => props.muteSound()}
          disableTouchRipple={true}
          iconClassName="material-icons"
          iconStyle={styles.largeIcon}
          style={styles.large}>
          volume_up
        </IconButton>
      </div>
    )
  } else {
    return (
      <div style={{ position: 'absolute', left: '1%', bottom: '1%'}}>
        <IconButton
          onClick={() => props.unmuteSound()}
          disableTouchRipple={true}
          iconClassName="material-icons"
          iconStyle={styles.largeIcon}
          style={styles.large}>
          volume_off
        </IconButton>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  sound: state.sound
})

const mapDispatchToProps = (dispatch) => ({
  muteSound: () => dispatch(muteSound()),
  unmuteSound: () => dispatch(unmuteSound())
})

export default connect(mapStateToProps, mapDispatchToProps)(MuteButton)
