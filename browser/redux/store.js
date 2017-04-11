import { createStore, applyMiddleware } from 'redux';
// import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import reducer from './rootreducer';

const store = createStore(reducer, applyMiddleware(thunk));

export default store;
