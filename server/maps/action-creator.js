const { GENERATE_MAP, EXPLODE_BOX } = require('./constants');

const loadMap = (map) => {
  return {
    type: GENERATE_MAP,
    map
  }
}

const updateMap = (coordinates) => {
  return {
    type: EXPLODE_BOX,
    coordinates
  }
}

module.exports = {
  loadMap,
  updateMap
}
