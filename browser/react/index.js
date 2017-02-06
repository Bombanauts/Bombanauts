import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import { Provider } from 'react-redux'
import store from '../store'
// import { initializeSocket } from '../socket';

// initializeSocket();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
      document.getElementById('app')
)

