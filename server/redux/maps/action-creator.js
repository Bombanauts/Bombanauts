const { GENERATE_MAP, EXPLODE_BOX } = require('./constants');

const loadMap = (map, roomId) => ({
  type: GENERATE_MAP,
  map,
  roomId
})

const updateMap = (coordinates, roomId) => ({
  type: EXPLODE_BOX,
  coordinates,
  roomId
})

module.exports = {
  loadMap,
  updateMap
}
