import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableHighlight, FlatList, ToastAndroid } from 'react-native';
import time from '../utils/time';
const MY_MSG = 1;
const OTHERS_MSG = 2;
const SYSTEM_MSG = 3;
import config from '../config';

import io from 'socket.io-client';

class InputBox extends Component {

    state = {
        v: ''
    }
    handleChangeText = v => {
        this.setState({
            v
        });
        console.log(v);
    }
    handleSendMsg = () => {
        console.log('Input Box hit Send Button Onpress');
        const { onSendMsg } = this.props;
        onSendMsg && onSendMsg(this.state.v);
        this.setState({
            v: ''
        })
    }
    render() {
        return (
            <View style={styles.inputBox}>
                <TextInput
                    onChangeText={this.handleChangeText}
                    value={this.state.v}
                    style={styles.inputBoxInput}></TextInput>
                <TouchableHighlight
                    onPress={this.handleSendMsg}>
                    <Text style={styles.inputBoxSend}>发送</Text>
                </TouchableHighlight>
            </View>
        );
    }
}

class MsgItem extends Component {

    render() {
        const normalMsgItemStyles = StyleSheet.create({
            msgItem: {
                backgroundColor: '#fff',
                marginBottom: 3,
                paddingBottom: 10,
                flexDirection: 'row',
                justifyContent: 'center'
            },
            msgItemName: {
                fontSize: 15,
                paddingLeft: 10,
                fontWeight: "500",
                color: '#000'
            },
            msgItemContent: {
                paddingLeft: 10
            },
            msgItemTime: {
                padding: 10
            },
            isMe: {
                backgroundColor: '#f8f2dc'
            }
        });

        const systemMsgItemStyles = StyleSheet.create({
            msgItem: {
                backgroundColor: 'rgba(0,0,0,0.05)',
                padding: 5,
                alignItems: 'center'
            },
            msgItemName: {
                display: 'none'
            },
            msgItemContent: {
                fontWeight: '500',
                textAlign: 'center'
            },
            msgItemTime: {
                // padding: 10
                display: 'none'
            },
        });
        const { item } = this.props;
        console.log('this', item);
        const styles = item.type === SYSTEM_MSG
            ? systemMsgItemStyles
            : normalMsgItemStyles;
        return (
            <View
                style={
                    [
                        styles.msgItem, item.type === MY_MSG
                            ? styles.isMe
                            : null
                    ]}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.msgItemName}>{item.name}</Text>
                    <Text style={styles.msgItemContent}>{item.content}</Text>
                </View>
                <View>
                    <Text style={styles.msgItemTime}>{item.time}</Text>
                </View>
            </View>
        );
    }
}

class Chat extends Component {
    state = {
        msgList: [],
        newMsg: 0,
        curCnt: 0
    }
    constructor(props) {
        super(props);
        this.socket = io(`${config.host}:${config.port}`,{
            transports: ['websocket'],
          });

        this.socket.emit('join', this.props.name);
        this.socket.on('joinChat', this.handleUpdateMsg);
        this.socket.on('update_msg', this.handleUpdateMsg);
        this.socket.on('update_msg_broadcast', this.handleUpdateMsg);
        this.socket.on('offline', this.handleUpdateMsg);

    }

    componentWillUnmount() {
        this.socket.emit('bye', this.props.name);
        this.socket.disconnect();
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
        if (v === '') {
            ToastAndroid.show("发送消息不能为空", ToastAndroid.SHORT);
            return;
        }
        const msgBody = {
            name: this.props.name,
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
        return (
            <View style={styles.chatMain}>
                <View style={styles.headBar}>
                    <Text style={styles.headTitle}>{this.props.name}|当前在线人数:{this.state.curCnt}</Text>

                </View>

                <FlatList
                    ref="_flatlist"
                    style={styles.chatList}
                    data={this.state.msgList}
                    onEndReached={this.onEndOfList}
                    renderItem={({ item }) => <MsgItem item={item} />} />
                <InputBox
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
    inputBox: {

        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,

        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: '#fff',
        padding: 10

    },
    inputBoxInput: {
        flex: 1,
        borderColor: '#ddd',
        borderRadius: 3,
        borderWidth: 1,
        padding: 3,
    },
    inputBoxSend: {
        fontSize: 15,
        padding: 8,
        backgroundColor: '#9f9fff',
        color: '#fff'
    },
});
export default Chat;