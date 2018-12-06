import React, { Component } from 'react';
import { Text, View, StyleSheet, FlatList,ToastAndroid, Image, BackHandler, Dimensions } from 'react-native';
import NavBar from '../../components/NavBar';
import SendMsgBox from '../../components/SendMsgBox';
import socket from '../../socket';
import { connect } from 'react-redux';
import { msgMapToLocalRecord } from '../../utils/formatMap';
import ActionCreators from '../../actions';
import { bindActionCreators } from 'redux';
import MessageItem from './MessageItem';
import RefreshList from 'react-native-refreshlist';

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
        flag: false
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
        this.setState({
            flag: true
        })
        // socket.on('receive_msg', this.handleReceiveMsg);
    }
    getRecords = () => {
        const chatItemData = this.props.navigation.getParam('data');
        const { actionGetRecord } = this.props;
        console.log("=======>", actionGetRecord);
        const { friend_id } = chatItemData;
        actionGetRecord(friend_id);
    }

    componentDidMount() {
        const { onInChating, chat } = this.props;
        const chatItemData = this.props.navigation.getParam('data');

        const { friend_id, friend_name, friend_pic } = chatItemData;
        this.initPage();
        this.getRecords();
        this.setState({
            recordList: chat.recordList
        })
        this.initListeners();
        onInChating({
            friend_id,
            friend_name,
            friend_pic
        });

    }

    componentDidUpdate() {

        // const len = this.props.chat.recordList.length;
        // if (len) {
        // this._listRef.scrollToEnd();
        // }
        this._listRef.setData(this.props.chat.recordList);

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
        if(friend_id === this.props.userinfo.uid){
            ToastAndroid.show("怎么，你想和自己聊天？",ToastAndroid.LONG);
            return ;
        }
        socket.emit('sayTo', msgBody);
    }

    _renderItem = item => {
        const { friend_pic, my_pic, friend_name } = this.state;
        // console.log("item iiii=>", item);
        return (
            <MessageItem data={
                {
                    ...item,
                    friend_pic: item.send_type === 1 ? my_pic : friend_pic
                }
            } />
        )
    }
    _onPullRelease = (resolve) => {
        const { actionGetMoreRecord } = this.props;
        const { chat: { recordList } } = this.props;
        const { friend_id } = this.state;

        const initId = recordList[0].id;
        setTimeout(() => {
            resolve();
            actionGetMoreRecord(friend_id,initId);
            // this._listRef.setData(this.props.chat.recordList);
        }, 1000);
    }
    _loadMore = () => {

    }
    render() {
        const { friend_pic, my_pic, friend_name } = this.state;

        console.log("this=====", this.state);
        const { height, width } = Dimensions.get('window');
        return (
            <View style={styles.wrapper}>

                <NavBar title={friend_name} showBack={true} />
                <RefreshList
                    ref={(list) => this._listRef = list}
                    onPullRelease={(resolve) => this._onPullRelease(resolve)}
                    ItemHeight={80}
                    // onEndReached={() => this._loadMore()}
                    renderItem={({ item }) => this._renderItem(item)} />
                <SendMsgBox
                    onSendMsg={this.handleSendMsg} />
            </View>
        );
    }
    componentWillUnmount = () => {
        const { onOutChating, clearUnreadMsgCount } = this.props;
        onOutChating();
        clearUnreadMsgCount(this.state.friend_id); // 清空未读
        this.setState({
            flag: false
        })
        // socket.on('receive_msg', ()=>{});
        // socket.removeEventListener('receive_msg');
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
        actionGetRecord: bindActionCreators(ActionCreators.db.actionGetRecord, dispatch),
        onOutChating: bindActionCreators(ActionCreators.ui.actionOutChating, dispatch),
        onInChating: bindActionCreators(ActionCreators.ui.actionInChating, dispatch),
        clearUnreadMsgCount: bindActionCreators(ActionCreators.ui.actionClearNewMsgCount, dispatch),
        actionGetMoreRecord: bindActionCreators(ActionCreators.db.actionGetMoreRecord, dispatch),

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SingleChat);