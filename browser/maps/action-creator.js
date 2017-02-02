import { GENERATE_MAP } from './constants';

export const loadMap = (map) => {
  return {
    type: GENERATE_MAP,
    map
  }
}
