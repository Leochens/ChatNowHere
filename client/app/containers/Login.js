import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableHighlight, ToastAndroid } from 'react-native';
import ZButton from '../components/ZButton';
import ZInputBox from '../components/ZInputBox';
import axios from 'axios';

import socket from '../socket';
import NavBar from '../components/NavBar';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as ActionCreators from '../actions';
class Login extends Component {
    constructor(props) {
        super(props);
        this.socket = socket;
    }
    state = {
        username: 'hlw',
        password: '123'
    }
    handleLogin = () => {
        const { navigate } = this.props.navigation;
        const { password, username } = this.state;
        const {actionLoginSuc,actionLoginFai } = this.props;
        if (!username || !password) {
            ToastAndroid.show("请输入完全", ToastAndroid.SHORT);
            return;
        }

        axios(
            'http://192.168.43.17:3001/dbtest/login', {
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
                actionLoginSuc(res.data);// 发登录成功的action
                navigate('ChatList');
            }else{
                actionLoginFai && actionLoginFai();
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
const mapStateToProps = state => {
    return state;
}
const mapDispatchToProps = dispatch => {
    return {
        actionLoginSuc: bindActionCreators(ActionCreators.actionLoginSuc,dispatch),
        actionLoginFai: bindActionCreators(ActionCreators.actionLoginFai,dispatch)
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(Login);