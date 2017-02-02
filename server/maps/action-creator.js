const { GENERATE_MAP, EXPLODE_BOX } = require('./constants');

const loadMap = (map, roomId) => {
  return {
    type: GENERATE_MAP,
    map,
    roomId
  }
}

const updateMap = (coordinates, roomId) => {
  return {
    type: EXPLODE_BOX,
    coordinates,
    roomId
  }
}

module.exports = {
  loadMap,
  updateMap
}
