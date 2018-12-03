import React, { Component } from 'react';
import { Text, View, StyleSheet, FlatList, Image } from 'react-native';
import NavBar from '../../components/NavBar';
import SendMsgBox from '../../components/SendMsgBox';
import ReactSQLite from '../../nativeModules/ReactSQLite';
import socket from '../../socket';
import { connect } from 'react-redux';
import { msgMapToChatItem, msgMapToLocalRecord } from '../../utils/formatMap';

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#fff',
        height: "100%",
        width: "100%"
    }
})

class MessageItem extends Component {


    static defaultProps = {
        data: {
            friend_pic: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2778724530,551237406&fm=26&gp=0.jpg',
            content: '你好啊',
            send_type: 1,
        }
    }
    renderFriendMsg = () => {
        const { content, friend_pic } = this.props.data;

        return (
            <View style={{
                padding: 16,
                paddingBottom: 0,
            }}>
                <Image style={{
                    height: 32, width: 32, borderRadius: 16
                }}
                    source={{ uri: friend_pic }}
                ></Image>
                <Text style={{
                    borderRadius: 8,
                    borderTopLeftRadius: 0,
                    padding: 8,
                    marginLeft: 32,
                    borderColor: '#eee',
                    borderWidth: 1,
                    fontSize: 16,
                    width: (content.length) * 24
                }}>
                    {content}
                </Text>
            </View>
        )
    }
    renderMyMsg = () => {
        const { content, friend_pic } = this.props.data;
        return (
            <View style={{
                padding: 16,
                paddingBottom: 0,
            }}>
                <Image style={{
                    height: 32, width: 32, borderRadius: 16, alignSelf: 'flex-end'
                }}
                    source={{ uri: friend_pic }}
                ></Image>
                <Text style={{
                    borderRadius: 8,
                    borderTopRightRadius: 0,
                    padding: 8,
                    marginRight: 32,
                    borderColor: '#eee',
                    borderWidth: 1,
                    fontSize: 16,
                    width: (content.length) * 24,
                    alignSelf: 'flex-end'
                }}>
                    {content}
                </Text>
            </View>
        );
    }
    render() {
        const { friend_pic, content, send_type } = this.props.data;
        const styles = StyleSheet.create({

        })

        return send_type === 1 ? this.renderMyMsg() : this.renderFriendMsg();
    }
}


class SingleChat extends Component {


    state = {
        recordList: [],
        my_id: 0,
        my_name: '',
        my_pic: '',
        friend_id: 0,
        friend_name: '',
        friend_pic: '',
    }
    initPage = () => {
        const chatItemData = this.props.navigation.getParam('data');
        const {
            userinfo: {
                uid: my_id,
                user_pic: my_pic,
                username: my_name
            }
        } = this.props;
        console.log('私聊路由跳转参数', chatItemData);
        const {
            friend_id,
            friend_name,
            friend_pic,
            last_msg_time
        } = chatItemData;
        this.setState({
            friend_id, friend_name, friend_pic,
            my_id, my_name, my_pic
        })
    }
    initListeners = () => {
        socket.on('receive_msg', this.handleReceiveMsg);
    }
    getRecords = () => {
        const chatItemData = this.props.navigation.getParam('data');

        const { friend_id } = chatItemData;
        console.log("SingleChat | in getRecords", this.state);
        ReactSQLite.getChatRecords(friend_id, res => {
            console.log("聊天记录为", res);
            this.setState({
                recordList: res
            })
        });
    }

    componentDidMount() {
        this.initPage();
        this.getRecords();
        this.initListeners();
    }

    handleReceiveMsg = msg => {
        console.log("SingelChat=====>get msg : ", msg);

        const recordList = this.state.recordList.slice();
        const localFormatRecord = msgMapToLocalRecord(msg); // 转成本地存储格式的消息

        console.log("更新消息", msg, "本地格式", localFormatRecord);
        recordList.push(localFormatRecord);
        this.setState({
            recordList
        })
    }

    handleSendMsg = v => {
        const { friend_id, friend_name } = this.state;
        const msgBody = {
            toId: friend_id,
            toName: friend_name,
            content: v,
        }
        socket.emit('sayTo', msgBody);
    }
    render() {
        const { friend_pic, my_pic, friend_name } = this.state;

        return (
            <View style={styles.wrapper}>
                <NavBar title={friend_name} />
                <FlatList
                    style={{
                        marginBottom: 80
                    }}
                    data={this.state.recordList}
                    renderItem={({ item }) => <MessageItem data={
                        {
                            ...item,
                            friend_pic: item.send_type === 1 ? my_pic : friend_pic
                        }
                    } />}
                ></FlatList>
                <SendMsgBox
                    onSendMsg={this.handleSendMsg} />
            </View>
        );
    }

    // 为了消除异步任务
    componentWillUnmount = () => {
        console.log("卸载组件");
        socket.on('receive_msg_in_chat', ()=>{});

        // const {recordList} = this.state; 
        // const unSavedRecords = recordList.filter(item=>!item.id); // 找出没有经过本地编号的 一定是没有存储的记录

        // unSavedRecords.forEach(record=>ReactSQLite.addMsg(record));

        this.setState = (state,callback)=>{
          return;
        };
    }
}

const mapStateToProps = state => {
    return {
        userinfo: state.userinfo,
    }
}
export default connect(mapStateToProps)(SingleChat);