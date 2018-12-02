import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableHighlight, ToastAndroid } from 'react-native';
import ZButton from '../../components/ZButton';
import ZInputBox from '../../components/ZInputBox';


class Regist extends Component {
    state = {
        username: '',
        password: ''
    }
    handleRegist = () => {
        const { navigate } = this.props.navigation; 
        const {password,username} = this.state;

        if(!username || !password){
            ToastAndroid.show("请输入完全",ToastAndroid.SHORT);
            return;
        }
        navigate('Index');

        // if(username == 'zhl' && password == '123456'){
        //     navigate('Index');
        // }else{
        //     ToastAndroid.show("用户名或密码错误",ToastAndroid.SHORT);
        // }
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
                        placeholder={'用户名'}
                        placeholderTextColor={'#888'}
                        style={styles.inputBox} />
                    <ZInputBox
                        onChangeText={this.getUsername}
                        textContentType="nickname"
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
    registBtn: {},
    copyright: {}
});
export default Regist;