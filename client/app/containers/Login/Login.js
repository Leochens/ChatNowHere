import React, { Component } from 'react';
import styles from './style';
import { Text, View, ToastAndroid, Image } from 'react-native';
import ZButton from '../../components/ZButton';
import ZInputBox from '../../components/ZInputBox';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ActionCreators from '../../actions';


class Login extends Component {

    constructor(props){
        super(props);
        if(props.userinfo.is_login){
            props.navigation.navigate('ChatList');
        }
    }
    
    state = {
        username: 'hlw',
        password: '123',
        user_pic: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3260609003,3965213395&fm=27&gp=0.jpg'
    }
    checkFiled = () => {
        const { password, username } = this.state;
        return (username && password);
    }
    componentDidUpdate(){
        if(this.props.userinfo.is_login){
            this.props.navigation.navigate('ChatList');
        }
    }
    handleLogin = () => {
        const { navigate } = this.props.navigation;
        const { password, username } = this.state;
        const { actionLogin } = this.props;
        if (!this.checkFiled()) {
            ToastAndroid.show("请输入完全", ToastAndroid.SHORT);
            return;
        }
        actionLogin && actionLogin({username,password});

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
    toRegist = () => {
        this.props.navigation.navigate('Regist');
    }
    render() {
        return (
            <View style={styles.main}>

                <View style={styles.formMain}>
                    <View>
                        <Image
                            style={{
                                width: 72,
                                height: 72,
                                borderRadius: 36,
                                alignSelf: 'center',
                                margin: 16,
                            }}
                            source={{ uri: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=517389657,4030031755&fm=200&gp=0.jpg' }} />
                    </View>
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
                        style={{
                            width: '60%'
                        }}
                    />
                    <ZButton
                        text={'注册'}
                        onClick={this.toRegist}
                        style={{
                            width: '60%',
                            marginTop: 16,
                            backgroundColor: '#a00'
                        }}
                    />

                </View>
                    <Text style={styles.title}>「小瓷缸」</Text>
            </View>
        )
    }
}


const mapStateToProps = state => {
    return {
        userinfo:state.userinfo
    }
}
const mapDispatchToProps = dispatch => {
    return {
        actionLogin: bindActionCreators(ActionCreators.server.actionLogin, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Login);





