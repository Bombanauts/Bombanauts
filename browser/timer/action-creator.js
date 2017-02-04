import {
  SET_TIME,
  GET_TIME
} from './constants';

export const setTime = (time, timeLimit) => ({
  type: SET_TIME,
  time,
  timeLimit
})

export const getTime = () => ({
  type: GET_TIME
})
