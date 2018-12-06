import React, { Component } from 'react';

import { View, StyleSheet, FlatList, BackHandler, NativeModules, Text, ToastAndroid } from 'react-native';
import NavBar from '../../components/NavBar';
import socket from '../../socket';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactSQLite from '../../nativeModules/ReactSQLite';
import ActionCreators from '../../actions';
import ListItem from './ListItem/ListItem';
import { msgMapToChatItem, msgMapToLocalRecord } from '../../utils/formatMap';
import TabBar from '../../components/TabBar';
import Slider from '../../components/SideMenu';

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
        startX: 0,
        endX: 0,
    }
    constructor(props) {
        super(props);
        const { username, uid, actionFetchChatList, actionReceiveMsg } = props;
        BackHandler.addEventListener('hardwareBackPress', this.handleback);
        socket.on('fetch_receive_msg', actionFetchChatList);
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
        if (this.props.isChating)
            return false;

        if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
            //最近2秒内按过back键 可以退出应用
            BackHandler.exitApp();
            return;
        }
        this.lastBackPressed = Date.now();
        ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
        return true;
    }

    componentDidMount() {
        if (!socket.connected) {
            socket.connect();
            alert("当前socket已经断开" + socket.connected)
        }
        const { username, uid, actionGetChatList } = this.props;
        actionGetChatList && actionGetChatList();
        // 获取完本地的再请求加入 然后获取自己在服务器上的未读消息 注意顺序 不然本地的会覆盖网络的
        socket.emit('join', { username, uid });

    }

    handleApplySocketErr = err => console.log(err);
    handleApplySocketSuc = res => console.log(res);
    handleUpdateMsg = (msg, confirm) => {
        console.log("ChatList=====>get msg : ", msg);
        const { isChating, actionUpdateRecord, actionUpdateChatList } = this.props;
        const localChatItem = msgMapToChatItem(msg);; // 把新消息转成聊天列表项
        // 更新消息列表
        // ReactSQLite.addMsg(msgMapToLocalRecord(msg));
        actionUpdateRecord && actionUpdateRecord(msgMapToLocalRecord(msg));
        actionUpdateChatList && actionUpdateChatList({ isChating, msg: localChatItem });
        confirm();
    }




    onTouchStart = e => {
        console.log(e.nativeEvent.locationX);
        this.setState({
            startX: e.nativeEvent.locationX,
        })
    }
    onTouchEnd = e => {
        const { startX } = this.state;
        const { locationX: endX } = e.nativeEvent;
        console.log("endX", endX);
        console.log('StartX', startX, endX > startX)

        if (endX > startX) {
            alert("左滑");
            this.props.navigation.navigate("Slider");
        }
    }
    changeUser = () => {
        socket.disconnect();
        this.props.navigation.navigate("Login");
        this.props.actionLogout();
    }
    onStartShouldSetResponderCapture = (event, gestureState) => {
        console.log("event", event, gestureState);
        if (event === 'onTouchStart' || event === 'onTouchEnd')
            return true;
        return false
    }
    render() {
        const navigate = this.props.navigation.navigate;
        const menu = <Text style={{ marginTop: 22 }}>aaa</Text>;
        return (
            <Slider>

                <View
                    // onStartShouldSetResponderCapture={this.onStartShouldSetResponderCapture}
                    // onTouchStart={this.onTouchStart}
                    // onTouchEnd={this.onTouchEnd}
                    style={styles.wrapper}>
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
                        data={this.props.list}
                        // onEndReached={this.onEndOfList}
                        renderItem={({ item }) => <ListItem
                            data={item}
                            navigate={navigate}
                        />} />
                    <TabBar
                        navigate={navigate}
                        action={this.createNewChat}
                    />

                </View>
            </Slider>
        );
    }
}

const mapStateToProps = state => {
    return {
        username: state.userinfo.username,
        uid: state.userinfo.uid,
        user_pic: state.userinfo.user_pic,
        isChating: state.chat.isChating,
        is_login: state.ui.is_login,
        list: state.chatList.list
    }
}

const mapDispatchToProps = dispatch => {
    return {
        actionLogout: bindActionCreators(ActionCreators.server.actionLogout, dispatch),
        actionGetChatList: bindActionCreators(ActionCreators.db.actionGetChatList, dispatch),
        actionClearNewMsgCount: bindActionCreators(ActionCreators.ui.actionClearNewMsgCount, dispatch),
        actionUpdateRecord: bindActionCreators(ActionCreators.db.actionUpdateRecord, dispatch),
        actionUpdateChatList: bindActionCreators(ActionCreators.db.actionUpdateChatList, dispatch),
        actionFetchChatList: bindActionCreators(ActionCreators.server.actionFetchChatList, dispatch),
        actionReceiveMsg: bindActionCreators(ActionCreators.db.actionReceiveMsg, dispatch),

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ChatList);