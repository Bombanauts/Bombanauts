const {
  SET_TIME,
  GET_TIME
} = require('./constants');

const setTime = (time, timeLimit, roomId) => {
  console.log('in action creator', time, timeLimit, roomId)
  return {
  type: SET_TIME,
  time,
  timeLimit,
  roomId
}
}

const getTime = (roomId) => ({
  type: GET_TIME,
  roomId
})

module.exports = {
  setTime,
  getTime
}
