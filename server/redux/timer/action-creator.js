const { SET_TIME, GET_TIME } = require('./constants');

const setTime = (time, roomId) => ({
  type: SET_TIME,
  time,
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
