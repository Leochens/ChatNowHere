import React,{Component} from 'react';
import {View,Text,StyleSheet} from 'react-native';
import {MY_MSG,SYSTEM_MSG,OTHERS_MSG} from '../constaints';

class MsgItem extends Component {

    render() {
        const normalMsgItemStyles = StyleSheet.create({
            msgItem: {
                backgroundColor: '#fff',
                marginBottom: 3,
                paddingBottom: 10,
                flexDirection: 'row',
                justifyContent: 'center'
            },
            msgItemName: {
                fontSize: 15,
                paddingLeft: 10,
                fontWeight: "500",
                color: '#000'
            },
            msgItemContent: {
                paddingLeft: 10
            },
            msgItemTime: {
                padding: 10
            },
            isMe: {
                backgroundColor: '#f8f2dc'
            }
        });

        const systemMsgItemStyles = StyleSheet.create({
            msgItem: {
                backgroundColor: 'rgba(0,0,0,0.05)',
                padding: 5,
                alignItems: 'center'
            },
            msgItemName: {
                display: 'none'
            },
            msgItemContent: {
                fontWeight: '500',
                textAlign: 'center'
            },
            msgItemTime: {
                // padding: 10
                display: 'none'
            },
        });
        const { item } = this.props;
        console.log('this', item);
        const styles = item.type === SYSTEM_MSG
            ? systemMsgItemStyles
            : normalMsgItemStyles;
        return (
            <View
                style={
                    [
                        styles.msgItem, item.type === MY_MSG
                            ? styles.isMe
                            : null
                    ]}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.msgItemName}>{item.name}</Text>
                    <Text style={styles.msgItemContent}>{item.content}</Text>
                </View>
                <View>
                    <Text style={styles.msgItemTime}>{item.time}</Text>
                </View>
            </View>
        );
    }
}

export default MsgItem;