import React, { Component } from 'react';
import LinearGradient from 'react-native-linear-gradient';

import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ToastAndroid,
    BVLinearGradient
} from 'react-native';

import { NativeModules } from 'react-native';


class Index extends Component {
    state = {
        v: ''
    }
    onGetName = () => {
        const { v: name } = this.state;
        if (name === '') {
            ToastAndroid.show('用户名为空', ToastAndroid.SHORT);
            return;
        }
        this.props.navigation.navigate('GroupChat', { name });
    }
    handleChangeText = v => {
        this.setState({
            v
        });
    }
    render() {
        // NativeModules.ZToast.show('hello ZToast', NativeModules.ZToast.LONG);
        NativeModules.ZService.test();

        return (
            <LinearGradient
                colors={['#CE9FFC', '#7367F0']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.wrapper}>

                <View style={styles.indexMain}>
                    <Text style={{ fontSize: 35, padding: 10, color: '#fff' }}>「陌聊」</Text>
                    <Text style={{
                        marginBottom: 35,
                        color: '#fff'
                    }} >
                        陌生人，一起来唠唠吧
                    </Text>
                    <TextInput
                        placeholder={'输入你的昵称'}
                        placeholderTextColor={'#bbb'}
                        style={styles.nameInput}
                        value={this.state.v}
                        onChangeText={this.handleChangeText}
                    ></TextInput>
                    <TouchableOpacity
                        onPress={this.onGetName}>
                        <Text style={styles.getInBtn}>加入</Text>
                    </TouchableOpacity>
                    <View style={styles.copyright}>
                        <Text style={styles.copytext}>
                            张鹤麟 | Leochens
                    </Text>

                        <Text style={styles.copytext}>
                            技术栈: react-native, socket.io-client, express, java
                    </Text>
                    </View>
                </View>
            </LinearGradient>

        );
    }
}
const styles = StyleSheet.create({
    wrapper: {
        height: '100%',
        width: '100%'
    },
    indexMain: {
        height: '100%',
        width: '100%',
        alignItems: 'center',
        paddingTop: 100
    },

    nameInput: {
        borderBottomColor: "#aaa",
        borderBottomWidth: 1,
        width: 200,
        textAlign: 'center',
        padding: 4,
        fontSize: 20
    },
    getInBtn: {
        marginTop: 20,
        backgroundColor: '#FF7365',
        padding: 10,
        paddingLeft: 60,
        paddingRight: 60,
        color: '#fff',
        borderRadius: 10
    },
    copyright: {
        position: 'absolute',
        bottom: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    copytext: {
        color: '#333'

    }

});
export default Index;
