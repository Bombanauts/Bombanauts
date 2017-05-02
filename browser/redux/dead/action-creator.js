import { KILL_PLAYER, REVIVE_PLAYER } from './constants';

export const killPlayer = () => ({ type: KILL_PLAYER });

export const revivePlayer = () => ({ type: REVIVE_PLAYER });

