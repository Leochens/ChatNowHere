import React, { Component } from 'react';
import styles from './style';

import { Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import Side from '../../../components/SideMenu';;

export default class ListItem extends Component {
    static defaultProps = {
        navigate: () => { },
        data: {
            friend_name: 'Leochens',
            friend_id: 0,
            last_msg_content: 'hello world',
            last_msg_time: '13:01',
            new_msg_count: 1,
            friend_pic: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=517389657,4030031755&fm=200&gp=0.jpg'
        }
    }
    formatTime = timeStr => {
        const arr = timeStr.split('T');
        const date = arr[0];
        const time = arr[1].split['.'][0];
        console.log(arr);
        return date + " " + time;
        // return '';
    }
    goChat = () => {
        const {
            navigate,
            data,
        } = this.props;
        if (navigate)
            navigate("SingleChat", { data });
        else
            console.log("local: ListItem; navigate is undefined");

    }
    onDelete = () => {
        const { data: { friend_id }, onDelete } = this.props;
        Alert.alert('删除', '此操作将会删除所有聊天记录',
            [
                {
                    text: "继续", onPress: () => {
                        console.log("删除", friend_id);
                        onDelete && onDelete(friend_id);
                    }
                },
                {
                    text: "返回"
                }
            ]
        );

    }
    render() {
        const {
            data: {
                friend_name,
                last_msg_content,
                last_msg_time,
                friend_pic,
                new_msg_count,
            },
        } = this.props;

        return (


            <TouchableOpacity
                onPress={this.goChat}
                onLongPress={this.onDelete}
            >
                {/* <Side> */}
                    <View style={styles.item}>
                        <View>
                            <Image
                                style={styles.user_pic}
                                source={{ uri: friend_pic || 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=517389657,4030031755&fm=200&gp=0.jpg' }} />
                        </View>
                        <View style={styles.middle}>
                            <Text style={styles.username}>{friend_name}</Text>
                            <Text style={styles.lastMsg}>{last_msg_content}</Text>
                        </View>
                        <View style={styles.right}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 8, paddingTop: 8 }}>
                                <Text style={{ fontSize: 10, color: '#999' }}>{last_msg_time}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 8, paddingTop: 8 }}>
                                <Text style={[styles.bubble, {
                                    display: new_msg_count ? 'flex' : 'none',
                                    backgroundColor: new_msg_count ? '#DE4233' : '#fff',
                                }]}>{new_msg_count}</Text>

                            </View>
                        </View>
                    </View>
                {/* </Side> */}
            </TouchableOpacity >

        );
    }

}