/** @format */

import { AppRegistry } from 'react-native';
import App from './app/App';
import { name as appName } from './app.json';
import BackgroundJob from 'react-native-background-job';

const backgroundJob = {
    jobKey: "myJob",
    job: () => console.log("Running in background")
};
BackgroundJob.register(backgroundJob);
var backgroundSchedule = {
    jobKey: "myJob",
}

BackgroundJob.schedule(backgroundSchedule);
AppRegistry.registerComponent(appName, () => App);


// import React, { Component } from 'react';
// import {
//     Alert,
//     AppRegistry,
//     AsyncStorage,
//     Button,
//     ScrollView,
//     StyleSheet,
//     Text,
//     View,
//     AppState
// } from 'react-native';
// import { name as appName } from './app.json';

// import BackgroundTask from 'react-native-background-task'

// function currentTimestamp() {
//     const d = new Date()
//     const z = n => n.toString().length == 1 ? `0${n}` : n // Zero pad
//     return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())} ${z(d.getHours())}:${z(d.getMinutes())}`
// }

// BackgroundTask.define(
//     async () => {
//         console.log('Hello from a background task')

//         const value = await AsyncStorage.getItem('@MySuperStore:times')
//         await AsyncStorage.setItem('@MySuperStore:times', `${value || ''}\n${currentTimestamp()}`)

//         // Or, instead of just setting a timestamp, do an http request
//         /* const response = await fetch('http://worldclockapi.com/api/json/utc/now')
//         const text = await response.text()
//         await AsyncStorage.setItem('@MySuperStore:times', text) */
//         setInterval(()=>{
//             console.log("进入后台1111");

//         },1000);
//         BackgroundTask.finish()
//     },
// )

// export default class AsyncStorageTimestamp extends Component {
//     constructor() {
//         super()
//         this.state = {
//             text: '',
//         }
//     }

//     componentDidMount() {
//         BackgroundTask.schedule()
//         this.checkStatus()
//         AppState.addEventListener('change', this._handleAppStateChange);

//     }
//     _handleAppStateChange = (nextAppState) => {
//         if (nextAppState != null && nextAppState === 'active') {
//             //如果是true ，表示从后台进入了前台 ，请求数据，刷新页面。或者做其他的逻辑
//             if (this.flage) {
//                 //这里的逻辑表示 ，第一次进入前台的时候 ，不会进入这个判断语句中。
//                 // 因为初始化的时候是false ，当进入后台的时候 ，flag才是true ，
//                 // 当第二次进入前台的时候 ，这里就是true ，就走进来了。
//                 //测试通过
//                 // for(const i)
//                 alert("从后台进入前台");
//                 setInterval(()=>{
//                     console.log("进入钱台");
    
//                 },1000);
//                 // 这个地方进行网络请求等其他逻辑。
//             }
//             this.flage = false;
//         } else if (nextAppState != null && nextAppState === 'background') {
//             this.flage = true;

//                 console.log("进入后台");

//         }
//         console.log(this.flage);
//     }

//     async checkStatus() {
//         const status = await BackgroundTask.statusAsync()
//         console.log(status.available)

//     }

//     render() {
//         return (
//             <ScrollView style={styles.container}>
//                 <Text style={styles.welcome}>
//                     react-native-background-task!
//         </Text>
//                 <Text style={styles.instructions}>
//                     The defined task (storing the current timestamp in AsyncStorage)
//                     should run while the app is in the background every 15 minutes.
//         </Text>
//                 <Text style={styles.instructions}>
//                     Press the button below to see the current value in storage.
//         </Text>
//                 <Button
//                     onPress={async () => {
//                         const value = await AsyncStorage.getItem('@MySuperStore:times')
//                         console.log('value', value)
//                         this.setState({ text: value })
//                     }}
//                     title="Get"
//                 />
//                 <Text>{this.state.text}</Text>
//             </ScrollView>
//         );
//     }
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#F5FCFF',
//         padding: 15,
//     },
//     welcome: {
//         fontSize: 20,
//         textAlign: 'center',
//         margin: 10,
//     },
//     instructions: {
//         textAlign: 'center',
//         color: '#333333',
//         marginBottom: 5,
//     },
// });
// AppRegistry.registerComponent(appName, () => AsyncStorageTimestamp);

// // AppRegistry.registerComponent('AsyncStorageTimestamp', () => AsyncStorageTimestamp);
