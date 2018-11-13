import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MY_MSG, SYSTEM_MSG, OTHERS_MSG } from '../constaints';

class MsgItem extends Component {
    render() {
        const { item } = this.props;
        console.log('this', item);
        const styles = item.type === SYSTEM_MSG
            ? systemMsgItemStyles
            : normalMsgItemStyles;
        return (

            <View style={wrapperStyles.wrapper}>
                <View style={[styles.userInfo,item.type === MY_MSG ? styles.myInfo: null]}>
                    <Text style={styles.msgItemName}>{item.name}</Text>
                    <Text style={styles.msgItemTime}>{item.time}</Text>
                </View>

                <View
                    style={
                        [
                            styles.msgItem, item.type === MY_MSG
                                ? styles.isMe
                                : null,
                            {
                                width: 15 * (item.content.length + 1)
                            }
                        ]}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.msgItemContent}>{item.content}</Text>
                    </View>
                </View>

            </View>
        );
    }
}

const wrapperStyles = StyleSheet.create({
    wrapper: {

        marginBottom: 10
    },

});
const normalMsgItemStyles = StyleSheet.create({
    msgItem: {
        backgroundColor: '#fff',

        flexDirection: 'row',
        justifyContent: 'center',
        maxWidth: '70%',
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 10,
        marginLeft: 10
    },
    msgItemName: {
        fontSize: 15,
        // paddingLeft: 10,
        fontWeight: "500",
        color: '#000'
    },
    msgItemContent: {
        paddingLeft: 10,
    },
    msgItemTime: {
        fontSize: 13,
        color: '#ccc',
        padding: 5
    },
    isMe: {
        backgroundColor: '#f8f2dc',
        alignSelf: 'flex-end',
        paddingRight: 5,
        marginRight: 10
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    myInfo: {
        alignSelf: 'flex-end'
    }
});

const systemMsgItemStyles = StyleSheet.create({
    msgItem: {
        backgroundColor: 'rgba(0,0,0,0.03)',
        padding: 3,
        alignItems: 'center',
        width: '70%',
        alignSelf: 'center',
        borderRadius: 10

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
export default MsgItem;