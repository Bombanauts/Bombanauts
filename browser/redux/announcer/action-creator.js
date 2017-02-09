import { ANNOUNCE_KILL, REMOVE_ANNOUNCEMENT } from './constants';

export const announce = (killer, victim) => {
  return {
    type: ANNOUNCE_KILL,
    killer,
    victim
  }
}

export const removeAnnouncement = () => {
  return {
    type: REMOVE_ANNOUNCEMENT
  }
}
