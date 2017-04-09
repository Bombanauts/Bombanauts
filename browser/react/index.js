import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import AppComponent from './App';
import store from '../redux/store';
import '../assets/stylesheets/style.scss';

injectTapEventPlugin();

const App = () => {
  return (
    <MuiThemeProvider>
      <AppComponent />
    </MuiThemeProvider>
  )
};

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
document.getElementById('app'));

