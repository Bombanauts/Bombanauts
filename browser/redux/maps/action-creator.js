import { GENERATE_MAP } from './constants';

export const loadMap = (map) => ({
  type: GENERATE_MAP,
  map
});
