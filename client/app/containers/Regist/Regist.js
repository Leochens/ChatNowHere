import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableHighlight, ToastAndroid } from 'react-native';
import ZButton from '../../components/ZButton';
import ZInputBox from '../../components/ZInputBox';
import axios from 'axios';
import config from '../../config';
class Regist extends Component {
    state = {
        username: '',
        password: '',
        email: '',
        user_pic:'https://www.botreetechnologies.com/blog/wp-content/uploads/2017/08/logo.png'
    }
    handleRegist = () => {
        const { navigate } = this.props.navigation;
        const { password, username, email,user_pic } = this.state;

        axios(`${config.host}:${config.port}/dbtest/regist`,{
            method: 'POST',
            headers: {
                'Content-Type':'application/x-www-form-urlencoded'
            },
            data: {
                password,
                username,
                email,
                user_pic
            }
        }).then(res=>{
            if(res.data.status === 200)
                navigate('Login');
            else
                alert(res.data.msg);

        })
        .catch(err=>{
            alert(err)
        })


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
    getEmail = email => {
        this.setState({
            email
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
                        placeholder={'用户名'}
                        placeholderTextColor={'#888'}
                        style={styles.inputBox} />
                    <ZInputBox
                        onChangeText={this.getEmail}
                        placeholder={'邮箱'}
                        placeholderTextColor={'#888'}
                        style={styles.inputBox} />
                    <ZInputBox
                        onChangeText={this.getPassword}

                        textContentType="password"
                        placeholder={'密码'}
                        placeholderTextColor={'#888'}
                        secureTextEntry={true}
                        style={styles.inputBox} />
                    <ZButton
                        text={'注册'}
                        onClick={this.handleRegist}
                        style={{
                            width: '60%'
                        }}
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
        paddingTop: 60,
        backgroundColor: '#fff'
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
    registBtn: {},
    copyright: {}
});
export default Regist;