import React, { Component } from 'react';
import { Text, View, StyleSheet, FlatList, Image } from 'react-native';
import NavBar from '../../components/NavBar';
import SendMsgBox from '../../components/SendMsgBox';
import ReactSQLite from '../../nativeModules/ReactSQLite';
import socket from '../../socket';
import { connect } from 'react-redux';

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
            user_pic: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2778724530,551237406&fm=26&gp=0.jpg',
            content: '你好啊',
            type: 1,
        }
    }
    renderFriendMsg = () => {
        const { content, userPic } = this.props.data;

        return (
            <View style={{
                padding: 16,
                paddingBottom: 0,
            }}>
                <Image style={{
                    height: 32, width: 32, borderRadius: 16
                }}
                    source={{ uri: userPic }}
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
        const { content, userPic } = this.props.data;
        return (
            <View style={{
                padding: 16,
                paddingBottom: 0,
            }}>
                <Image style={{
                    height: 32, width: 32, borderRadius: 16, alignSelf: 'flex-end'
                }}
                    source={{ uri: userPic }}
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
        const { userPic, content, type } = this.props.data;
        const styles = StyleSheet.create({

        })

        return type === 1 ? this.renderMyMsg() : this.renderFriendMsg();
    }
}


class SingleChat extends Component {

    state = {
        msgList: [],
    }

    componentDidMount(){
        const from_id = this.props.navigation.getParam('from_id');
        const from_name = this.props.navigation.getParam('from_name');
        const login_user_id = this.props.navigation.getParam('login_user_id');

        socket.on('receive_msg_in_chat',this.handleReceiveMsg);
        console.log('私聊路由跳转参数',from_id,from_name,login_user_id);
        ReactSQLite.getChatRecords("s"+from_id+"_"+login_user_id,res=>{
            console.log("聊天记录为",res);
            this.setState({
                msgList: res
            })
        });
    }

    handleReceiveMsg = msg => {
        const msgList = this.state.msgList.slice();
        console.log("更新消息",msg);
        msgList.push(msg);
        ReactSQLite.addMsg(msg);// 消息存本地
        this.setState({
            msgList
        })
    }

    handleSendMsg = v => {
        const from_id = this.props.navigation.getParam('from_id');
        const from_name = this.props.navigation.getParam('from_name');

        const msgBody = {
            toName:  from_name,
            content: v,
            toId: from_id
        }
        socket.emit('sayTo',msgBody);
    }
    render() {
        const myPic = this.props.userinfo.user_pic;
        const from_name = this.props.navigation.getParam('from_name');
        // const friendPic = 
        // const login_user_id = this.props.navigation.getParam('from_user_');
        return (
            <View style={styles.wrapper}>
                <NavBar title={from_name} />
                <FlatList
                style={{
                    marginBottom: 80
                }}
                    data={this.state.msgList}
                    renderItem={({ item }) => <MessageItem data={
                        {
                            ...item,
                            user_pic: myPic
                        }
                    } />}
                ></FlatList>
                <SendMsgBox
                    onSendMsg={this.handleSendMsg} />
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        userinfo: state.userinfo
    }
}
export default connect(mapStateToProps)(SingleChat);