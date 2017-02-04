const {
  SET_TIME,
  GET_TIME
} = require('./constants');

const setTime = (time, timeLimit, roomId) => ({
  type: SET_TIME,
  time,
  timeLimit,
  roomId
})

const getTime = (roomId) => ({
  type: GET_TIME,
  roomId
})

module.exports = {
  setTime,
  getTime
}
