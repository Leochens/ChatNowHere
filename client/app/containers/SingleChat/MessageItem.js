import React, { Component } from 'react';
import { Text, View, StyleSheet, FlatList, Image, BackHandler, Dimensions } from 'react-native';



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
            <View
                style={{
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
                }}
                >
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

export default MessageItem;