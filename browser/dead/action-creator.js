export const KILL_PLAYER = 'KILL_PLAYER';
export const REVIVE_PLAYER = 'REVIVE_PLAYER';

export const killPlayer = () => {
  return {
    type: KILL_PLAYER
  }
}

export const revivePlayer = () => {
  return {
    type: REVIVE_PLAYER
  }
}

