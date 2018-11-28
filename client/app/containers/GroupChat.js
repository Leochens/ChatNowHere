import React, { Component } from 'react';
import io from 'socket.io-client';
import LinearGradient from 'react-native-linear-gradient';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    ToastAndroid,
    BackHandler,
    BVLinearGradient,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; //引入图标
import config from '../config';
import time from '../utils/time';

import MsgItem from '../components/MsgItem';
import SendMsgBox from '../components/SendMsgBox';
import { OTHERS_MSG, SYSTEM_MSG, MSG_LIST, MY_MSG } from '../constaints';
let lastBackPressed = Date.now();
class GroupChat extends Component {
    state = {
        msgList: [],
        curCnt: 0,
        users: []
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
        this.socket.on('connect_error', this.connectFailed);
        this.socket.on('connect', this.onConnectSuc);
        this.peekOnlineUsers();
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this._onBackPressed);
    }
    componentDidUpdate() {
        const list = this.refs._flatlist;
        list.scrollToEnd()
    }
    componentWillUnmount() {
        this.socket.disconnect();
    }
    connectFailed = () => {
        this.handleUpdateMsg({ content: '连接失败，请检查网络连接', type: SYSTEM_MSG });
        this.socket.disconnect();
    }
    onConnectSuc = () => {
        this.socket.emit('join', this.name);
    }
    _onBackPressed = () => {
        if (lastBackPressed && lastBackPressed + 2000 >= Date.now()) {
            return false;
        }
        lastBackPressed = Date.now();
        ToastAndroid.show('再按一次退出群聊', ToastAndroid.SHORT);
        return true;
    }

    peekUsers = () => {
        const that = this;
        that.socket.emit('getOnlineUsers', {}, function (users) {
            console.log('peek users', users);
            that.setState({
                users
            });
        });
    }
    // 每隔5秒刷新在线列表 也可以用作心跳包
    peekOnlineUsers = () => {
        this.peekUsers();
        setInterval(
            this.peekUsers, 5000
        );
    }
    handleReconnect = () => {
        this.socket.connect(`${config.host}:${config.port}`, {
            transports: ['websocket'],
        });
        this.handleUpdateMsg({ name: '系统', content: '您已掉线，客户端重连...', type: SYSTEM_MSG });

    }
    // 从服务器得到消息反馈 并显示在当前客户端
    handleUpdateMsg = msg => {
        console.log("get msg from server", msg);
        let msgList = this.state.msgList.slice();

        const { type } = msg;

        switch (type) {
            case MSG_LIST:
                msgList = msgList.concat(msg.msgs);
                msgList.push({
                    name: '系统',
                    content: '以上是为您拉取的20条历史信息',
                    type: SYSTEM_MSG
                });
                break;
            case OTHERS_MSG:
                ToastAndroid.show(`新消息${msg.name}:${msg.content}`, ToastAndroid.SHORT);
                msgList.push(msg);
                break;
            case MY_MSG:
                msgList.push(msg);
                break;
            case SYSTEM_MSG:
                msgList.push(msg);
                break;
            default: break;
        }

        this.setState({
            msgList,
            curCnt: msg.curCnt
        });

    }

    // 当前用户发消息
    handleSendMsg = v => {
        if (!this.socket.connected) {
            this.handleReconnect();
            return;
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

    sendMsgToAdmin = () => {

        const msg = {
            name: this.name,
            content: '你好，管理员',
            type: 2
        }
        this.socket.emit('sayTo', { toName: 'JJ', msg });
    }

    // 获得当前在线用户列表
    getOnlineUsers = () => {
        this.props.navigation.navigate('UserList', { users: this.state.users });

    }
    render() {
        console.log("===>", this.props.navigation.getParam('name'));
        // const name = this.props.navigation.getParam('name');
        // alert(name);
        return (
            <View
                style={styles.chatMain}>
                <LinearGradient
                    colors={['#CE9FFC', '#7367F0']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.headBar} >
                    <Text style={styles.headTitle}>{this.name}|在世界群聊</Text>
                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            right: 10
                        }}>
                        <Icon
                            onPress={this.getOnlineUsers}
                            name='md-list' size={30} color='#fff' />
                    </TouchableOpacity>

                </LinearGradient>

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
        marginBottom: 50,
        backgroundColor: '#F1E7FF'
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
        color: '#fff',


    },

});
export default GroupChat;
