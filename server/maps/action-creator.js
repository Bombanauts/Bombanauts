const { GENERATE_MAP } = require('./constants');

const loadMap = (map) => {
  return {
    type: GENERATE_MAP,
    map
  }
}

module.exports = loadMap;
