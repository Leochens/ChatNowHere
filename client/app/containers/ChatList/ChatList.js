import React, { Component } from 'react';

import { View, StyleSheet, FlatList} from 'react-native';
import NavBar from '../../components/NavBar';
import socket from '../../socket';
import { connect } from 'react-redux';
import ReactSQLite from '../../nativeModules/ReactSQLite';
import ListItem from './ListItem/ListItem';


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
    handleApplySocketErr = err => console.log(err);
    handleApplySocketSuc = res => {
        console.log(res)
    };

    handleUpdateMsg = (msg, confirm) => {
        console.log("get msg : ", msg);
        const chatList = this.state.chatList.slice();
        const idMap = {};
        let friend_ids = chatList.map(chatItem => chatItem.friend_id); // 获得当前消息列表中用户的每个用户的id
        chatList.forEach((chatItem, idx) => { idMap[chatItem.friend_id] = idx });// 建立用户id和当前数组id的映射关系 方便查找
        
        if(friend_ids.includes(msg.from_id)){
            let new_msg_count = chatList[idMap[msg.from_id]].new_msg_count;
            const tmp = this.msgMapToChatItem(msg);
            const newItem ={ 
                ...tmp,
                new_msg_count: new_msg_count+1
             };
            console.log('tmp',newItem);
            ReactSQLite.updateChatListItem(newItem);
            chatList[idMap[msg.from_id]] = newItem;
        }else{
            chatList.push(this.msgMapToChatItem(msg));
        }

        ReactSQLite.addMsg(this.msgMapToLocalRecord(msg));
        
        this.setState({
            chatList
        });
        confirm();
    }

    // 将服务端发来的消息映射成本地存储格式的消息
    msgMapToLocalRecord = (msg) => ({
        friend_id:msg.from_id,
        friend_name: msg.from_name,
        create_time: msg.create_time,
        content: msg.content,
        send_type:msg.type,// 自己的 1 对方的 2 系统 3
        type: 1, // 文本 1 图片 2
        msg_status: msg.msg_status

    })

    // 将服务端发来的消息映射成本地好友消息列表的格式
    msgMapToChatItem = msg => ({
        friend_id: parseInt(msg.from_id),
        friend_name: msg.from_name,
        friend_pic: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=517389657,4030031755&fm=200&gp=0.jpg',
        last_msg_content: msg.content,
        last_msg_time: msg.create_time,
        new_msg_count: 1
    })

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
                    ...this.msgMapToChatItem(msg),
                    new_msg_count: chatList[idMap[msg.from_id]].new_msg_count + 1
                };
                chatList[idMap[msg.from_id]] = newItem;
            } else {   // 如果没有就添加该消息到消息列表
                chatList.push(this.msgMapToChatItem(msg));
            }
        }); 
        return chatList;
    }

    // 用户登录成功时触发 从服务端拉取自己离线时未能收到的消息
    handleUpdateMsgList = (newChatList, confirm) => {
        console.log(newChatList);
        console.log('fetch newChatList');
        const localFormatChatList = newChatList.map(item=>this.msgMapToLocalRecord(item));

        
        ReactSQLite.addMsgList(localFormatChatList);
        const chatList = this.getCleanChatList(newChatList);

        newChatList.forEach(item=>{
            ReactSQLite.updateChatListItem(this.msgMapToChatItem(item));
        })


        this.setState({
            chatList
        })
        
        // confirm(); //用户收到信息后回调它告诉服务端确认成功
    }

    render() {
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
                    renderItem={({ item }) => <ListItem data={item} />} />
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