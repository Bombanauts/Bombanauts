
import React from 'react'
import ReactDOM from 'react-dom'

import AppComponent from './App'
import { Provider } from 'react-redux'
import store from '../store'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

const App = () => {
  return (
    <MuiThemeProvider>
      <AppComponent />
    </MuiThemeProvider>
  )
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
)

