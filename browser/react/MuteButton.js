import React from 'react';
import { connect } from 'react-redux';
import { muteSound, unmuteSound } from '../redux/sound/action-creator';
import IconButton from 'material-ui/IconButton';

export const styles = {
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
  const muteOrUnmute = props.sound ? props.muteSound : props.unmuteSound;
  const icon = props.sound ? "volume_up" : "volume_off";

  return (
    <div className="mute">
      <IconButton
        onClick={muteOrUnmute}
        disableTouchRipple={true}
        iconClassName="material-icons"
        iconStyle={styles.largeIcon}
        style={styles.large}>
        {icon}
      </IconButton>
    </div>
  )
}

const mapStateToProps = (state) => ({
  sound: state.sound
})

const mapDispatchToProps = (dispatch) => ({
  muteSound: () => dispatch(muteSound()),
  unmuteSound: () => dispatch(unmuteSound())
})

export default connect(mapStateToProps, mapDispatchToProps)(MuteButton)
