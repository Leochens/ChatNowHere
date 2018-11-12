import React, { Component } from 'react';
import { StyleSheet, Text, View,ToastAndroid } from 'react-native';
import Chat from './containers/Chat';
import Index from './containers/Index';

import Test from './containers/Test';
export default class App extends Component {

  state = {
    status: 0,  // 界面切换 简易版路由
    name: ''
  }

  handleGetName = name => {
    if(!name){
      ToastAndroid.show("输入名为空，不能进入",ToastAndroid.SHORT);
      return ;
    }
    ToastAndroid.show(`亲爱的${name},你已加入群聊！`,ToastAndroid.SHORT);
    this.setState({
      name,
      status: 1
    })
  }
  render() {
    return (
      <View>
        {
          this.state.status
          ?<Chat
            name={this.state.name}/>
          :
          <Index onGetName={this.handleGetName}/>
          // <Test/>
        }
      </View>
    );
  }
}
