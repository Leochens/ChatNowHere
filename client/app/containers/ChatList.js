import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import NavBar from '../components/NavBar';


class ListItem extends Component {

    static defaultProps = {
        data: {
            username: 'Leochens',
            lastMsg: 'hello world',
            time: '13:01',
            bubble: 1,
            userPic: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=517389657,4030031755&fm=200&gp=0.jpg'
        }
    }
    render() {
        const {
            data: {
                username,
                lastMsg,
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
                        <Text style={styles.username}>{username}</Text>
                        <Text style={styles.lastMsg}>{lastMsg}</Text>
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
        chatList: [{
            username: '张鹤麟',
            userPic: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2016202132,237163917&fm=26&gp=0.jpg',
            time: '12:05',
            bubble: 3,
            lastMsg: '你干嘛呢'
        },
        {
            username: '李一丹',
            userPic: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=410781527,1881401538&fm=200&gp=0.jpg',
            time: '14:21',
            bubble: 1,
            lastMsg: '吃饭吗'
        },
        {
            username: '郝龙威',
            userPic: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=269983461,437926237&fm=200&gp=0.jpg',
            time: '11:41',
            bubble: 1,
            lastMsg: '啦啦啦啦啦'
        },
        {
            username: '郭阳阳',
            userPic: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2192128832,912984590&fm=26&gp=0.jpg',
            time: '19:32',
            bubble: '99+',
            lastMsg: '[图片]'
        },
        {
            username: '张鹤麟',
            userPic: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2016202132,237163917&fm=26&gp=0.jpg',
            time: '12:05',
            bubble: 3,
            lastMsg: '你干嘛呢'
        },
        {
            username: '李一丹',
            userPic: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=410781527,1881401538&fm=200&gp=0.jpg',
            time: '14:21',
            bubble: 1,
            lastMsg: '吃饭吗'
        },
        {
            username: '郝龙威',
            userPic: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=269983461,437926237&fm=200&gp=0.jpg',
            time: '11:41',
            bubble: 1,
            lastMsg: '啦啦啦啦啦'
        },
        {
            username: '郭阳阳',
            userPic: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2192128832,912984590&fm=26&gp=0.jpg',
            time: '19:32',
            bubble: '99+',
            lastMsg: '[图片]'
        }, {
            username: '张鹤麟',
            userPic: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2016202132,237163917&fm=26&gp=0.jpg',
            time: '12:05',
            bubble: 3,
            lastMsg: '你干嘛呢'
        },
        {
            username: '李一丹',
            userPic: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=410781527,1881401538&fm=200&gp=0.jpg',
            time: '14:21',
            bubble: 1,
            lastMsg: '吃饭吗'
        },
        {
            username: '郝龙威',
            userPic: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=269983461,437926237&fm=200&gp=0.jpg',
            time: '11:41',
            bubble: 1,
            lastMsg: '啦啦啦啦啦'
        },
        {
            username: '郭阳阳',
            userPic: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2192128832,912984590&fm=26&gp=0.jpg',
            time: '19:32',
            bubble: '99+',
            lastMsg: '[图片]'
        }, {
            username: '张鹤麟',
            userPic: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2016202132,237163917&fm=26&gp=0.jpg',
            time: '12:05',
            bubble: 3,
            lastMsg: '你干嘛呢'
        },
        {
            username: '李一丹',
            userPic: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=410781527,1881401538&fm=200&gp=0.jpg',
            time: '14:21',
            bubble: 1,
            lastMsg: '吃饭吗'
        },
        {
            username: '郝龙威',
            userPic: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=269983461,437926237&fm=200&gp=0.jpg',
            time: '11:41',
            bubble: 1,
            lastMsg: '啦啦啦啦啦'
        },
        {
            username: '郭阳阳',
            userPic: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2192128832,912984590&fm=26&gp=0.jpg',
            time: '19:32',
            bubble: '99+',
            lastMsg: '[图片]'
        }, {
            username: '张鹤麟',
            userPic: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2016202132,237163917&fm=26&gp=0.jpg',
            time: '12:05',
            bubble: 3,
            lastMsg: '你干嘛呢'
        },
        {
            username: '李一丹',
            userPic: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=410781527,1881401538&fm=200&gp=0.jpg',
            time: '14:21',
            bubble: 1,
            lastMsg: '吃饭吗'
        },
        {
            username: '郝龙威',
            userPic: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=269983461,437926237&fm=200&gp=0.jpg',
            time: '11:41',
            bubble: 1,
            lastMsg: '啦啦啦啦啦'
        },
        {
            username: '郭阳阳',
            userPic: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2192128832,912984590&fm=26&gp=0.jpg',
            time: '19:32',
            bubble: '99+',
            lastMsg: '[图片]'
        },

        ]
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