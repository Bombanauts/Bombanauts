import React from 'react';
import { connect } from 'react-redux';
import IconButton from 'material-ui/IconButton';

import { muteSound, unmuteSound } from '../redux/sound/action-creator';
import { getIsMuted } from '../redux/sound/reducer';

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
  const { sound, muteSound, unmuteSound } = props;
  const muteOrUnmute = sound ? muteSound : unmuteSound;
  const icon = sound ? "volume_up" : "volume_off";

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

const mapStateToProps = (state) => ({ sound: getIsMuted(state) });

const mapDispatchToProps = { muteSound, unmuteSound };

export default connect(mapStateToProps, mapDispatchToProps)(MuteButton);
