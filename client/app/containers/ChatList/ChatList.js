import React, { Component } from 'react';

import { View, StyleSheet, FlatList, BackHandler, NativeModules, ToastAndroid } from 'react-native';
import NavBar from '../../components/NavBar';
import socket from '../../socket';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactSQLite from '../../nativeModules/ReactSQLite';
import * as ActionCreators from '../../actions';
import ListItem from './ListItem/ListItem';
import { msgMapToChatItem, msgMapToLocalRecord } from '../../utils/formatMap';
import TabBar from '../../components/TabBar';
const styles = StyleSheet.create({
    chatList: {
        backgroundColor: '#fff'
    },
    wrapper: {
        height: '100%',
        width: '100%',
        backgroundColor: '#fff'
    }
});

class ChatList extends Component {
    state = {
        chatList: [],
    }
    constructor(props) {
        super(props);
        const { username, uid } = props;
        BackHandler.addEventListener('hardwareBackPress', this.handleback);
        socket.on('fetch_receive_msg', this.handleUpdateMsgList);
        socket.on('apply_socket_suc', this.handleApplySocketSuc);
        socket.on('apply_socket_err', this.handleApplySocketErr);
        socket.on('receive_msg', this.handleUpdateMsg);
        socket.on('reconnect', function (data) {
            console.log("ChatList reconnect");
            // 重连后再发一遍join
            socket.emit('join', { username, uid });
        });
    }
    handleback = () => {
        if (this.props.is_chating)
            return false;

        if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
            //最近2秒内按过back键，可以退出应用。
            BackHandler.exitApp();
            return;
        }
        this.lastBackPressed = Date.now();
        ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
        return true;
    }
    handleInChating = () => {
        const { actionInChating } = this.props;
        actionInChating && actionInChating();
    }
    handleOutChating = () => {
        const { actionOutChating } = this.props;
        actionOutChating && actionOutChating();
    }
    // 清空未读提醒
    clearUnreadMsgCount = (friend_id) => {
        const chatList = this.state.chatList.slice();
        let itemId = -1;
        for (let i = 0; i < chatList.length; i++) {
            if (chatList[i].friend_id === friend_id) {
                itemId = i;
            }
        }
        if (itemId === -1) return;

        chatList[itemId] = {
            ...chatList[itemId],
            new_msg_count: 0
        };
        console.log("清空好友" + friend_id + "的未读提醒", chatList[itemId]);
        this.setState({

            chatList
        })
    }

    componentDidMount() {
        if (!socket.connected) {
            socket.connect();
            alert("当前socket已经断开" + socket.connected)
        }
        const { username, uid } = this.props;
        ReactSQLite.getChatList(list => {
            if (list) {
                this.setState({
                    chatList: list
                })
            }
        });
        // 获取完本地的再请求加入 然后获取自己在服务器上的未读消息 注意顺序 不然本地的会覆盖网络的
        socket.emit('join', { username, uid });

    }

    handleApplySocketErr = err => console.log(err);
    handleApplySocketSuc = res => console.log(res);
    handleUpdateMsg = (msg, confirm) => {
        console.log("ChatList=====>get msg : ", msg);
        const { is_chating } = this.props;
        const localChatItem = msgMapToChatItem(msg);; // 把新消息转成聊天列表项
        const chatList = this.state.chatList.slice();
        const idMap = {};
        let friend_ids = chatList.map(chatItem => chatItem.friend_id); // 获得当前消息列表中用户的每个用户的id
        chatList.forEach((chatItem, idx) => { idMap[chatItem.friend_id] = idx });// 建立用户id和当前数组id的映射关系 方便查找

        if (friend_ids.includes(msg.from_id)) {
            const indexOfTargetChatItem = idMap[msg.from_id];
            const { new_msg_count } = chatList[indexOfTargetChatItem];
            // const tmp = msgMapToChatItem(msg);
            const newItem = {
                ...localChatItem,
                new_msg_count: is_chating ? 0 : new_msg_count + 1
            };
            console.log('tmp', newItem);
            chatList[indexOfTargetChatItem] = newItem;
            ReactSQLite.updateChatListItem(newItem);

        } else {
            chatList.push({
                ...localChatItem,
                new_msg_count: 1
            });
            ReactSQLite.updateChatListItem({
                ...localChatItem,
                new_msg_count: 1
            });
        }

        // 更新消息列表
        ReactSQLite.addMsg(msgMapToLocalRecord(msg));

        this.setState({
            chatList
        });
        confirm();
    }





    // 将消息列表进行归纳处理 一个人的消息都归到一起
    getCleanChatList = list => {
        const chatList = this.state.chatList.slice();
        const idMap = {};
        let friend_ids = chatList.map(msg => msg.friend_id); // 获得当前消息列表中用户的每个用户的id

        console.log("getCleanChatList");

        list.forEach(msg => {
            friend_ids = chatList.map(chatItem => chatItem.friend_id); // 获得当前消息列表中用户的每个用户的id
            chatList.forEach((chatItem, idx) => { idMap[chatItem.friend_id] = idx });// 建立用户id和当前数组id的映射关系 方便查找 
            if (friend_ids.includes(msg.from_id)) { // 如果当前列表中有该用户发的消息，那么就覆盖该消息，并把消息数加一
                const newItem = {
                    ...msgMapToChatItem(msg),
                    new_msg_count: chatList[idMap[msg.from_id]].new_msg_count + 1
                };
                chatList[idMap[msg.from_id]] = newItem;
                ReactSQLite.updateChatListItem(newItem);

                console.log("覆盖原来的好友" + newItem.friend_name + "的消息,当前用户的未读消息", newItem.new_msg_count);
            } else {   // 如果没有就添加该消息到消息列表
                console.log("添加新的好友消息");
                chatList.push({ ...msgMapToChatItem(msg), new_msg_count: 1 });
                ReactSQLite.updateChatListItem({ ...msgMapToChatItem(msg), new_msg_count: 1 });
            }
        });
        return chatList;
    }

    // 用户登录成功时触发 从服务端拉取自己离线时未能收到的消息
    handleUpdateMsgList = (newChatList, confirm) => {
        console.log(newChatList);
        console.log('fetch newChatList');
        const chatList = this.getCleanChatList(newChatList);
        this.setState({
            chatList
        })


        // 将拉取得未读消息存入sqlite
        const localFormatChatList = newChatList.map(item => msgMapToLocalRecord(item));
        ReactSQLite.addMsgList(localFormatChatList);
        confirm(); //用户收到信息后回调它告诉服务端确认成功
    }
    changeUser = () => {
        socket.disconnect();
        this.props.navigation.navigate("Login");
        this.props.actionLogout();
    }
    createNewChat = () => {
        alert("hello new chat")
    }
    render() {
        const navigate = this.props.navigation.navigate;

        return (
            <View style={styles.wrapper}>
                <NavBar
                    title="消息"
                    showBack={false}
                    moreOptions={[
                        {
                            title: '切换账号',
                            onPress: this.changeUser
                        }
                    ]} />
                <FlatList
                    ref="_flatlist"
                    style={styles.chatList}
                    data={this.state.chatList}
                    // onEndReached={this.onEndOfList}
                    renderItem={({ item }) => <ListItem
                        data={item}
                        navigate={navigate}
                        clearUnreadMsgCount={this.clearUnreadMsgCount}
                        onInChating={this.handleInChating}
                        onOutChating={this.handleOutChating}
                    />} />
                <TabBar

                    action={this.createNewChat}
                />
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        username: state.userinfo.username,
        uid: state.userinfo.uid,
        user_pic: state.userinfo.user_pic,
        is_chating: state.userinfo.is_chating,
        is_login: state.userinfo.is_login
    }
}

const mapDispatchToProps = dispatch => {
    return {
        actionInChating: bindActionCreators(ActionCreators.actionInChating, dispatch),
        actionOutChating: bindActionCreators(ActionCreators.actionOutChating, dispatch),
        actionLogout: bindActionCreators(ActionCreators.actionLogout, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ChatList);