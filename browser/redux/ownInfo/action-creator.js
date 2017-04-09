import { SET_SCORE, SET_NAME } from './constants';

export const setScore = (score) => ({
  type: SET_SCORE,
  score
})

export const setName = (name) => ({
  type: SET_NAME,
  name
})
