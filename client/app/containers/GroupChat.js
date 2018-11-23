import React, { Component } from 'react';
import io from 'socket.io-client';
import config from '../config';
import time from '../utils/time';

import MsgItem from '../components/MsgItem';
import SendMsgBox from '../components/SendMsgBox';
import { StyleSheet, View, Text, FlatList, ToastAndroid,BackHandler,AppState } from 'react-native';
import { OTHERS_MSG, SYSTEM_MSG } from '../constaints';
let lastBackPressed = Date.now();
class GroupChat extends Component {
    state = {
        msgList: [],
        curCnt: 0,
    }
    constructor(props) {
        super(props);
        this.socket = io(`${config.host}:${config.port}`, {
            transports: ['websocket'],
        });
        this.name = this.props.navigation.getParam('name');
        this.socket.on('joinChat', this.handleUpdateMsg);
        this.socket.on('update_msg', this.handleUpdateMsg);
        this.socket.on('update_msg_broadcast', this.handleUpdateMsg);
        this.socket.on('offline', this.handleUpdateMsg);
        this.socket.on('connect_error',this.connectFailed);
        this.socket.on('connect',this.onConnectSuc);
        this.socket.on('test',function(res){console.log('test===>>',res)})
    }
    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress',this._onBackPressed);
    }
    connectFailed = () => {
        this.handleUpdateMsg({content: '连接失败，请检查网络连接',type: SYSTEM_MSG});
        this.socket.disconnect();
    }
    onConnectSuc = () => {
        this.socket.emit('join', this.name);

    }
    _onBackPressed = () => {
        if (lastBackPressed && lastBackPressed + 2000 >= Date.now()) {
            BackHandler.exitApp();
          }
          lastBackPressed = Date.now();
          ToastAndroid.show('再按一次退出群聊', ToastAndroid.SHORT);
          return true;
    }
    componentWillUnmount() {
        this.socket.emit('exit');
    }

    handleReconnect = () => {
        // this.socket.disconnect();
        this.socket.connect(`${config.host}:${config.port}`, {
            transports: ['websocket'],
        });
        this.handleUpdateMsg({name: '系统',content: '您已掉线，客户端重连...',type: SYSTEM_MSG});
        
    }
    exit = () => {
        this.socket.emit('exit');
    }
    // 从服务器得到消息反馈 并显示在当前客户端
    handleUpdateMsg = msg => {
        console.log("get msg from server", msg);
        const msgList = this.state.msgList.slice();

        const { type } = msg;
        if (type === OTHERS_MSG)
            ToastAndroid.show(`新消息${msg.name}:${msg.content}`, ToastAndroid.SHORT);

        msgList.push(msg);
        this.setState({
            msgList,
            curCnt: msg.curCnt
        });

    }

    // 当前用户发消息
    handleSendMsg = v => {
        if(!this.socket.connected){
            this.handleReconnect();
            return ;
        }

        if (v === '') {
            ToastAndroid.show("发送消息不能为空", ToastAndroid.SHORT);
            return;
        }


        const msgBody = {
            name: this.name,
            content: v,
            time: time()
        }
        console.log('client send msg', msgBody);
        this.socket.emit('send_msg', msgBody);
    }
    componentDidUpdate() {
        const list = this.refs._flatlist;
        list.scrollToEnd()
    }
    render() {
        console.log("===>", this.props.navigation.getParam('name'));
        const name = this.props.navigation.getParam('name');


        return (
            <View style={styles.chatMain}>
                <View style={styles.headBar}>
                    <Text style={styles.headTitle}>{this.name}|当前在线人数:{this.state.curCnt}</Text>
                    <Text onPress={()=>{this.exit();}}>dis</Text>
                </View>
                <FlatList
                    ref="_flatlist"
                    style={styles.chatList}
                    data={this.state.msgList}
                    onEndReached={this.onEndOfList}
                    renderItem={({ item }) => <MsgItem item={item} />} />
                <SendMsgBox
                    onSendMsg={this.handleSendMsg} />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    chatMain: {
        height: '100%',
        width: '100%'
    },
    chatList: {
        // marginTop: 50,
        position: 'absolute',
        top: 50,
        bottom: 0,
        left: 0,
        right: 0,
        marginBottom: 50
    },
    headBar: {
        position: 'absolute',
        height: 50,
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "#9f9fff",
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    headTitle: {
        fontSize: 15,
        color: '#fff'
    },

});
export default GroupChat;
