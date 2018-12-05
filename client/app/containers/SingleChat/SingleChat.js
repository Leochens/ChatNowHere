import React, { Component } from 'react';
import { Text, View, StyleSheet, FlatList, Image, BackHandler, Dimensions } from 'react-native';
import NavBar from '../../components/NavBar';
import SendMsgBox from '../../components/SendMsgBox';
import socket from '../../socket';
import { connect } from 'react-redux';
import { msgMapToLocalRecord } from '../../utils/formatMap';
import ActionCreators from '../../actions';
import { bindActionCreators } from 'redux';
import MessageItem from './MessageItem';
const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#fff',
        height: "100%",
        width: "100%"
    }
})

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
        console.log('私聊路由跳转参数////', chatItemData);
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
        const {actionGetRecord} = this.props;
        console.log("=======>",actionGetRecord);
        const { friend_id } = chatItemData;
        actionGetRecord(friend_id);
    }

    componentDidMount() {
        const {onInChating,chat} = this.props;
        
        this.initPage();
        this.getRecords();
        this.setState({
            recordList:chat.recordList
        })
        this.initListeners();
        onInChating();
    }

    componentDidUpdate() {

        const len = this.state.recordList.length;
        if (len) {
            // this.refs.flatlist.scrollToEnd();
        }
    }

    handleReceiveMsg = msg => {
        console.log("SingelChat=====>get msg : ", msg);
        const {clearUnreadMsgCount} = this.props;

        const recordList = this.state.recordList.slice();
        const localFormatRecord = msgMapToLocalRecord(msg); // 转成本地存储格式的消息

        console.log("更新消息", msg, "本地格式", localFormatRecord);
        recordList.push(localFormatRecord);
        this.setState({
            recordList
        })

        clearUnreadMsgCount && clearUnreadMsgCount(this.state.friend_id);
    }
    _onEndReached = () => {
        // alert("加载")
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
        const { height, width } = Dimensions.get('window');
        return (
            <View style={styles.wrapper}>
                <NavBar title={friend_name} showBack={true} />
                <FlatList
                    onRefresh={() => {  }}
                    onEndReachedThreshold={2}
                    refreshing={true}
                    ListFooterComponent={<View></View>}
                    ref="flatlist"
                    style={{
                        maxHeight: height - 72
                    }}
                    onEndReached={this._onEndReached}
                    data={this.props.chat.recordList}
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
    componentWillUnmount = () => {
        const {onOutChating,clearUnreadMsgCount} = this.props;
        onOutChating();
        clearUnreadMsgCount(this.state.friend_id); // 清空未读
        console.log("卸载组件 清空未读");
    }
}

const mapStateToProps = state => {
    return {
        userinfo: state.userinfo,
        chat: state.chat
    }
}
const mapDispatchToProps = dispatch => {
    return {
        actionGetRecord: bindActionCreators(ActionCreators.db.actionGetRecord,dispatch),
        onOutChating:bindActionCreators(ActionCreators.ui.actionOutChating,dispatch),
        onInChating:bindActionCreators(ActionCreators.ui.actionInChating,dispatch),
        clearUnreadMsgCount: bindActionCreators(ActionCreators.ui.actionClearNewMsgCount,dispatch)
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(SingleChat);