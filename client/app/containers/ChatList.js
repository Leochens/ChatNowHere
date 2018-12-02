import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import NavBar from '../components/NavBar';
import socket from '../socket';
import { connect } from 'react-redux';
import ReactSQLite from '../nativeModules/ReactSQLite';

class ListItem extends Component {


    static defaultProps = {
        data: {
            from_name: 'Leochens',
            // lastMsg: 'hello world',
            content: 'hello world',
            time: '13:01',
            bubble: 1,
            user_pic: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=517389657,4030031755&fm=200&gp=0.jpg'
        }
    }

    render() {
        const {
            data: {
                from_name,
                content,
                time,
                user_pic,
                bubble
            }
        } = this.props;
        const styles = StyleSheet.create({
            item: {
                height: 80,
                borderBottomColor: '#eee',
                borderBottomWidth: 1,
                alignItems: 'center',
                flexDirection: 'row'
            },
            user_pic: {
                width: 64,
                height: 64,
                borderRadius: 32,
                marginRight: 8,
                marginLeft: 8
            },
            middle: {
                flex: 1
            },
            username: {
                fontSize: 16,
                color: '#666',
                paddingBottom: 8,
                paddingTop: 8
            },
            lastMsg: {
                flex: 1,
                fontSize: 12,
                color: '#999',
                paddingBottom: 8,
                paddingTop: 8
            },
            right: {
                marginRight: 16
            },
            bubble: {
                backgroundColor: bubble ? '#DE4233' : '#fff',
                width: 16,
                height: 16,
                borderRadius: 8,
                textAlign: 'center',
                color: '#fff',
                lineHeight: 16,
                fontSize: 8,


            }
        })
        return (
            <TouchableOpacity>

                <View style={styles.item}>
                    <View>
                        <Image
                            style={styles.user_pic}
                            source={{ uri: user_pic }} />
                    </View>
                    <View style={styles.middle}>
                        <Text style={styles.username}>{from_name}</Text>
                        <Text style={styles.lastMsg}>{content}</Text>
                    </View>
                    <View style={styles.right}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 8, paddingTop: 8 }}>
                            <Text style={{ fontSize: 10, color: '#999' }}>{time}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 8, paddingTop: 8 }}>
                            <Text style={styles.bubble}>{bubble}</Text>

                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

}
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
        this.socket = socket;
        this.socket.on('fetch_receive_msg', this.handleUpdateMsgList);
        this.socket.on('apply_socket_suc', this.handleApplySocketSuc);
        this.socket.on('apply_socket_err', this.handleApplySocketErr);
        this.socket.on('receive_msg', this.handleUpdateMsg);
        this.socket.emit('join', { username, uid });
    }
    handleApplySocketErr = err => console.log(err);
    handleApplySocketSuc = res => {
        console.log(res)
    };

    handleUpdateMsg = (msg, confirm) => {
        console.log("get msg : ", msg);
        const chatList = this.state.chatList.slice();
        const idMap = {};
        const from_ids = chatList.map(msg => msg.from_id); // 获得当前消息列表中用户的每个用户的id
        chatList.forEach((msg, idx) => { idMap[msg.from_id] = idx });// 建立用户id和当前数组id的映射关系 方便查找
        
        if(from_ids.includes(msg.from_id)){
            let bubble = chatList[idMap[msg.from_id]].bubble;
            const tmp = this.msgMapToChatItem(msg);
            const newItem ={ 
                ...tmp,
                bubble: bubble+1
             };
            console.log('tmp',newItem);
            ReactSQLite.updateChatListItem(newItem);
            chatList[idMap[msg.from_id]] = newItem;
        }else{
            chatList.push(this.msgMapToChatItem(msg));
        }
        ReactSQLite.addMsg(msg);
        
        this.setState({
            chatList
        });
        confirm();
    }
    msgMapToChatItem = msg => ({
        from_id: msg.from_id,
        from_name: msg.from_name,
        content: msg.content,
        time: msg.create_time,
        bubble: 1,
        user_pic: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=517389657,4030031755&fm=200&gp=0.jpg'
    })

    getCleanChatList = list => {
        const chatList = this.state.chatList.slice();
        const idMap = {};
        let from_ids = chatList.map(msg => msg.from_id); // 获得当前消息列表中用户的每个用户的id
        list.forEach(msg => {
            from_ids = chatList.map(msg => msg.from_id); // 获得当前消息列表中用户的每个用户的id
            chatList.forEach((msg, idx) => { idMap[msg.from_id] = idx });// 建立用户id和当前数组id的映射关系 方便查找 
            if (from_ids.includes(msg.from_id)) { // 如果当前列表中有该用户发的消息，那么就覆盖该消息，并把消息数加一
                const newItem = {
                    ...this.msgMapToChatItem(msg),
                    bubble: chatList[idMap[msg.from_id]].bubble + 1
                };
                chatList[idMap[msg.from_id]] = newItem;
                
            } else {   // 如果没有就添加该消息到消息列表
                chatList.push(this.msgMapToChatItem(msg));
            }
        });
        
        return chatList;
    }

    handleUpdateMsgList = (newChatList, confirm) => {
        console.log(newChatList);
        console.log('fetch newChatList');
        // chatList = newChatList.concat(chatList);
        ReactSQLite.addMsgList(newChatList);
        const chatList = this.getCleanChatList(newChatList);
        chatList.forEach(item=>{
            ReactSQLite.updateChatListItem(item);
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
        uid: state.userinfo.uid
    }
}
export default connect(mapStateToProps)(ChatList);