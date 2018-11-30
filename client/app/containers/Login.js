import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableHighlight, ToastAndroid } from 'react-native';
import ZButton from '../components/ZButton';
import ZInputBox from '../components/ZInputBox';
import axios from 'axios';

import socket from '../socket';
import NavBar from '../components/NavBar';

class Login extends Component {
    constructor(props) {
        super(props);
        this.socket = socket;
        this.socket.on('apply_socket_suc', this.handleApplySocketSuc);
        this.socket.on('apply_socket_err', this.handleApplySocketErr);
    }
    state = {
        username: 'hlw',
        password: '123'
    }

    handleApplySocketErr = err => console.log(err);
    handleApplySocketSuc = res => console.log(res);

    handleLogin = () => {
        const { navigate } = this.props.navigation;
        const { password, username } = this.state;

        if (!username || !password) {
            ToastAndroid.show("请输入完全", ToastAndroid.SHORT);
            return;
        }

        axios(
            'http://192.168.1.104:3001/dbtest/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: {
                    username: this.state.username,
                    password: this.state.password
                }
            }
        ).then(res => {
            if(res.data.status === 200){
                console.log(this.socket.connected);
                console.log(res.data);
                // this.socket.emit('join', { username: res.data.username, uid: res.data.uid });
                navigate('ChatList');
            }else{
                console.log('登录失败');
            }

        })
            .catch(err => console.log(err));

    }
    getUsername = username => {
        this.setState({
            username
        })
    }
    getPassword = password => {
        this.setState({
            password
        })
    }
    render() {
        return (
            <View style={styles.main}>
                <View>
                    <Text style={styles.title}>「小瓷缸」</Text>
                </View>
                <View style={styles.formMain}>
                    <ZInputBox
                        onChangeText={this.getUsername}
                        textContentType="nickname"
                        value={this.state.username}
                        placeholder={'用户名'}
                        placeholderTextColor={'#888'}
                        style={styles.inputBox} />
                    <ZInputBox
                        onChangeText={this.getPassword}
                        value={this.state.password}
                        textContentType="password"
                        placeholder={'密码'}
                        placeholderTextColor={'#888'}
                        secureTextEntry={true}
                        style={styles.inputBox} />
                    <ZButton
                        text={'登录'}
                        onClick={this.handleLogin}
                        width={'50%'}
                        align={'center'}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main: {
        height: '100%',
        width: '100%',
        marginTop: 60
    },
    formMain: {
        marginTop: 30
    },
    title: {
        textAlign: 'center',
        fontSize: 26,
        color: '#0d1740'
    },
    inputBox: {
        margin: 10,
        marginTop: 0,
        width: '70%',
        alignSelf: 'center'
    },
    loginBtn: {},
    copyright: {}
});
export default Login;