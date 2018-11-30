import React, { Component } from 'react';
import RouteStack from './routes';
import { Provider } from 'react-redux';
import store from './store';
export default class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <RouteStack />
      </Provider>
    );
  }
}

