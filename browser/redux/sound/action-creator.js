import { MUTE, UNMUTE } from './constants';

export const muteSound = () => ({ type: MUTE });

export const unmuteSound = () => ({ type: UNMUTE });
