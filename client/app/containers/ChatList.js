import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import NavBar from '../components/NavBar';
import socket from '../socket';


class ListItem extends Component {


    static defaultProps = {
        data: {
            from_name: 'Leochens',
            // lastMsg: 'hello world',
            content: 'hello world',
            time: '13:01',
            bubble: 1,
            userPic: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=517389657,4030031755&fm=200&gp=0.jpg'
        }
    }
    render() {
        const {
            data: {
                from_name,
                content,
                time,
                userPic,
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
            userPic: {
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
                            style={styles.userPic}
                            source={{ uri: userPic }} />
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

    constructor(props) {
        super(props);
        this.socket = socket;
        this.socket.on('fetch_receive_msg', this.handleUpdateMsgList);
        this.socket.on('apply_socket_suc', this.handleApplySocketSuc);
        this.socket.on('apply_socket_err', this.handleApplySocketErr);

    }
    handleApplySocketErr = err => console.log(err);
    handleApplySocketSuc = res => {
        console.log(res)
        this.socket.emit('join', { username: res.data.username, uid: res.data.uid });

    };
    handleUpdateMsgList = (msgList, confirm) => {
        console.log(msgList);

        let chatList = this.state.chatList.slice();
        chatList = msgList.concat(msgList);
        this.setState({
            chatList
        })
        // confirm(); //用户收到信息后回调它告诉服务端确认成功
    }
    state = {
        chatList: []
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

export default ChatList;