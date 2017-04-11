import { ANNOUNCE_KILL, REMOVE_ANNOUNCEMENT } from './constants';

export const announce = (killer, victim) => ({
  type: ANNOUNCE_KILL,
  killer,
  victim
});

export const removeAnnouncement = () => ({ type: REMOVE_ANNOUNCEMENT });
