import React, { Component } from 'react';
import { Text, View, StyleSheet, FlatList, Image } from 'react-native';
import NavBar from '../components/NavBar';
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
            userPic: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2778724530,551237406&fm=26&gp=0.jpg',
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

export default class Head extends Component {
    state = {
        msgList: [
            { type: 2, content: '啦啦啦啦', userPic: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3566067247,2734291894&fm=26&gp=0.jpg' },
            {
                userPic: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2778724530,551237406&fm=26&gp=0.jpg',
                content: '你好啊',
                type: 1,
            },
            {
                userPic: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2778724530,551237406&fm=26&gp=0.jpg',
                content: '你在干嘛',
                type: 1,
            },
            {
                userPic: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2778724530,551237406&fm=26&gp=0.jpg',
                content: '我好想你啊',
                type: 1,
            },
            { type: 2, content: '我也想你', userPic: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3566067247,2734291894&fm=26&gp=0.jpg' },

        ],
    }
    render() {
        return (
            <View style={styles.wrapper}>
                <NavBar title="擎冬" />
                <FlatList
                    data={this.state.msgList}
                    renderItem={({ item }) => <MessageItem data={item} />}
                ></FlatList>
            </View>
        );
    }
}