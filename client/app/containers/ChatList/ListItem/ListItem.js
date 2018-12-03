import React, { Component } from 'react';
import styles from './style';

import { Text, View, Image, TouchableOpacity } from 'react-native';


export default class ListItem extends Component {
    static defaultProps = {
        data: {
            friend_name: 'Leochens',
            last_msg_content: 'hello world',
            last_msg_time: '13:01',
            new_msg_count: 1,
            user_pic: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=517389657,4030031755&fm=200&gp=0.jpg'
        }
    }
    formatTime = timeStr => {

        const arr = timeStr.split('T');
        const date = arr[0];
        const time = arr[1].split['.'][0];
        console.log(arr);
        return date+" "+time;
        // return '';
    }
    render() {
        const {
            data: {
                friend_name,
                last_msg_content,
                last_msg_time,
                user_pic,
                new_msg_count
            }
        } = this.props;

        return (
            <TouchableOpacity>
                <View style={styles.item}>
                    <View>
                        <Image
                            style={styles.user_pic}
                            source={{ uri: user_pic|| 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=517389657,4030031755&fm=200&gp=0.jpg'}} />
                    </View>
                    <View style={styles.middle}>
                        <Text style={styles.username}>{friend_name}</Text>
                        <Text style={styles.lastMsg}>{last_msg_content}</Text>
                    </View>
                    <View style={styles.right}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 8, paddingTop: 8 }}>
                            <Text style={{ fontSize: 10, color: '#999' }}>{last_msg_time.split('T')[1].split('.')[0]}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 8, paddingTop: 8 }}>
                            <Text style={[styles.bubble, {
                                backgroundColor: new_msg_count ? '#DE4233' : '#fff',
                            }]}>{new_msg_count}</Text>

                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

}