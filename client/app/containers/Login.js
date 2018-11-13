import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableHighlight, ToastAndroid } from 'react-native';
import ZButton from '../components/ZButton';


class Login extends Component {
    render() {
        return (
            <View style={styles.main}>
                <View>
                    <Text style={styles.title}>小瓷缸</Text>
                </View>
                <View style={styles.formMain}>
                    <TextInput textContentType="nickname" style={styles.inputBox} />
                    <TextInput textContentType="password"
                        secureTextEntry={true}
                        style={styles.inputBox} />
                    <ZButton 
                        text={'点击'} 
                        onClick={()=>{alert('你好')}}
                        width={'50%'}
                        align={'center'}
                        />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main: {},
    formMain: {},
    title: {},
    inputBox: {},
    loginBtn: {},
    copyright: {}
});
export default Login;