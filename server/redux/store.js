const { createStore, applyMiddleware } = require('redux');
const thunk = require('redux-thunk').default;
const reducer = require('./rootreducer');

module.exports = createStore(reducer, applyMiddleware(thunk));
