'use strict';

//REACT
import React from 'react'
import ReactDOM from 'react-dom'

//STYLES
import '../assets/stylesheets/style.scss';

//THREE.JS
import * as THREE from 'three';

//CANNON.JS
import * as CANNON from 'cannon';

import AppComponent from './App'
import { Provider } from 'react-redux'
import store from '../redux/store'
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

