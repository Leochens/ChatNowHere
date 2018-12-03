import React, { Component } from 'react';

import { View, StyleSheet, FlatList } from 'react-native';
import NavBar from '../../components/NavBar';
import socket from '../../socket';
import { connect } from 'react-redux';
import ReactSQLite from '../../nativeModules/ReactSQLite';
import ListItem from './ListItem/ListItem';
import { msgMapToChatItem, msgMapToLocalRecord } from '../../utils/formatMap';

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
        chatList: []
    }
    constructor(props) {
        super(props);
        const { username, uid } = props;
        socket.on('fetch_receive_msg', this.handleUpdateMsgList);
        socket.on('apply_socket_suc', this.handleApplySocketSuc);
        socket.on('apply_socket_err', this.handleApplySocketErr);
        socket.on('receive_msg', this.handleUpdateMsg);
        socket.emit('join', { username, uid });
    }

    componentDidMount() {
        ReactSQLite.getChatList(list => {
            if (list) {
                this.setState({
                    chatList: list
                })
            }
        });
    }
    handleApplySocketErr = err => console.log(err);
    handleApplySocketSuc = res => {
        console.log(res)
    };

    handleUpdateMsg = (msg, confirm) => {
        console.log("ChatList=====>get msg : ", msg);
        const chatList = this.state.chatList.slice();
        const idMap = {};
        let friend_ids = chatList.map(chatItem => chatItem.friend_id); // 获得当前消息列表中用户的每个用户的id
        chatList.forEach((chatItem, idx) => { idMap[chatItem.friend_id] = idx });// 建立用户id和当前数组id的映射关系 方便查找

        if (friend_ids.includes(msg.from_id)) {
            let new_msg_count = chatList[idMap[msg.from_id]].new_msg_count;
            const tmp = msgMapToChatItem(msg);
            const newItem = {
                ...tmp,
                new_msg_count: new_msg_count + 1
            };
            console.log('tmp', newItem);
            ReactSQLite.updateChatListItem(msgMapToChatItem(msg));
            chatList[idMap[msg.from_id]] = newItem;
        } else {
            chatList.push(msgMapToChatItem(msg));
        }

        ReactSQLite.addMsg(msgMapToLocalRecord(msg));// 重发、、、

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
        list.forEach(msg => {
            friend_ids = chatList.map(chatItem => chatItem.friend_id); // 获得当前消息列表中用户的每个用户的id
            chatList.forEach((chatItem, idx) => { idMap[chatItem.friend_id] = idx });// 建立用户id和当前数组id的映射关系 方便查找 
            if (friend_ids.includes(msg.from_id)) { // 如果当前列表中有该用户发的消息，那么就覆盖该消息，并把消息数加一
                const newItem = {
                    ...msgMapToChatItem(msg),
                    new_msg_count: chatList[idMap[msg.from_id]].new_msg_count + 1
                };
                chatList[idMap[msg.from_id]] = newItem;
            } else {   // 如果没有就添加该消息到消息列表
                chatList.push(msgMapToChatItem(msg));
            }
        });
        return chatList;
    }

    // 用户登录成功时触发 从服务端拉取自己离线时未能收到的消息
    handleUpdateMsgList = (newChatList, confirm) => {
        console.log(newChatList);
        console.log('fetch newChatList');
        const localFormatChatList = newChatList.map(item => msgMapToLocalRecord(item));

        // 将拉取得未读消息存入sqlite
        ReactSQLite.addMsgList(localFormatChatList);
        const chatList = this.getCleanChatList(newChatList);
        // 更新消息列表
        newChatList.forEach(item => {
            ReactSQLite.updateChatListItem(msgMapToChatItem(item));
        })


        this.setState({
            chatList
        })

        confirm(); //用户收到信息后回调它告诉服务端确认成功
    }

    render() {
        const navigate = this.props.navigation.navigate;

        return (
            <View style={styles.wrapper}>
                <NavBar
                    title="消息"
                    showBack={false} />
                <FlatList
                    ref="_flatlist"
                    style={styles.chatList}
                    data={this.state.chatList}
                    // onEndReached={this.onEndOfList}
                    renderItem={({ item }) => <ListItem data={item} navigate={navigate} />} />
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        username: state.userinfo.username,
        uid: state.userinfo.uid,
        user_pic: state.userinfo.user_pic
    }
}
export default connect(mapStateToProps)(ChatList);