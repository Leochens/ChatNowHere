import React, { Component } from 'react';
import RouteStack from './routes';
import { Provider } from 'react-redux';
import store from './store';

import BackgroundTask from 'react-native-background-task'

BackgroundTask.define(() => {
  console.log('Hello from a background task')
  BackgroundTask.finish()
})
export default class App extends Component {

  componentDidMount(){
    BackgroundTask.schedule();
  }
  render() {
    return (
      <Provider store={store}>
        <RouteStack />
      </Provider>
    );
  }
}

