import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableHighlight,ToastAndroid } from 'react-native';


class Index extends Component {
    state = {
        v: ''
    }
    onGetName = () => {
        const {v:name} = this.state;
        if(name === ''){
            ToastAndroid.show('用户名为空',ToastAndroid.SHORT);
            return ;
        }
        this.props.navigation.navigate('Chat',{name});
    }
    handleChangeText = v => {
        this.setState({
            v
        });
    }
    render() {
        return (
            <View style={styles.indexMain}>
                <Text style={{fontSize: 30,padding: 10,color: '#a39f83'}}>「陌聊」</Text>
                <Text style={styles.tip}>输入你的昵称</Text>
                <TextInput
                    style={styles.nameInput}
                    value={this.state.v}
                    onChangeText={this.handleChangeText}
                ></TextInput>
                <TouchableHighlight
                    onPress={this.onGetName}>
                    <Text style={styles.getInBtn}>加入群聊</Text>
                </TouchableHighlight>
                <View style={styles.copyright}>
                    <Text >
                        张鹤麟 | Leochens 
                    </Text>
                    <Text >
                        陌生人，一起来唠唠吧。
                    </Text>
                    <Text >
                        技术栈: react-native, socket.io-client, express, java
                    </Text>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    indexMain: {
        height: '100%',
        width: '100%',
        // justifyContent: 'center',
        alignItems: 'center',
        // marginTop: 100
        paddingTop: 100
    },
    tip: {
        fontWeight: '500',
        fontSize: 20
    },
    nameInput: {
        borderBottomColor: "#f00",
        borderBottomWidth: 1,
        width: 200
    },
    getInBtn: {
        marginTop: 20,
        backgroundColor: 'rgb(255, 200, 166)',
        padding: 5,
        borderRadius: 3
    },
    copyright: {
        position: 'absolute',
        bottom: 25,
        justifyContent:'center',
        alignItems:'center'
    }

});
export default Index;
