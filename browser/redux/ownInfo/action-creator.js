import {
  SET_SCORE,
  SET_NAME
} from './constants';

export const setScore = (score) => {
  return {
    type: SET_SCORE,
    score
  }
}

export const setName = (name) => {
  return {
    type: SET_NAME,
    name
  }
}
