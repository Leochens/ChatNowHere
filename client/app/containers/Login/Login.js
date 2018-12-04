import React, { Component } from 'react';
import styles from './style';
import {Text, View, ToastAndroid } from 'react-native';
import ZButton from '../../components/ZButton';
import ZInputBox from '../../components/ZInputBox';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactSQLite from '../../nativeModules/ReactSQLite';
import * as ActionCreators from '../../actions';

const doLogin = (username, password) => {
    return axios(
        'http://192.168.43.17:3001/dbtest/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
                username,
                password
            }
        }
    )
}


class Login extends Component {

    state = {
        username: 'hlw',
        password: '123',
        user_pic: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3260609003,3965213395&fm=27&gp=0.jpg'
    }
    checkFiled = () => {
        const { password, username } = this.state;
        return (username && password);
    }

    handleLogin = () => {
        const { navigate } = this.props.navigation;
        const { password, username } = this.state;
        const { actionLoginSuc, actionLoginFai } = this.props;
        if (!this.checkFiled()) {
            ToastAndroid.show("请输入完全", ToastAndroid.SHORT);
            return;
        }
        doLogin(username, password)
            .then(res => {
                const { username, uid } = res.data;
                const { password, user_pic } = this.state;
                ReactSQLite.createDatabase(`${username}_${uid}.db`); // 给新用户建库
                if (res.data.status === 200) {
                    const userinfo = { username, password, user_pic, uid }; // 打包发给reducer
                    actionLoginSuc(userinfo);// 发登录成功的action
                    navigate('ChatList');// 跳转到聊天列表
                    console.log("登录成功");
                } else {
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


const mapStateToProps = state => {
    return state;
}
const mapDispatchToProps = dispatch => {
    return {
        actionLoginSuc: bindActionCreators(ActionCreators.actionLoginSuc, dispatch),
        actionLoginFai: bindActionCreators(ActionCreators.actionLoginFai, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Login);





