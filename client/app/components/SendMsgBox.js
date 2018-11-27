import React,{Component} from 'react';
import {View,Text,StyleSheet,TouchableHighlight,TextInput} from 'react-native';
import ZInputBox from './ZInputBox';
import ZButton from './ZButton';

class InputBox extends Component {
    state = {
        v: ''
    }
    handleChangeText = v => {
        this.setState({
            v
        });
    }
    handleSendMsg = () => {

        const { onSendMsg } = this.props;
        onSendMsg && onSendMsg(this.state.v);
        this.setState({
            v: ''
        })
    }
    render() {
        return (
            <View style={styles.inputBox}>
                <ZInputBox
                    onChangeText={this.handleChangeText}
                    value={this.state.v} />
                <ZButton 
                    onClick={this.handleSendMsg}
                    text={'发送'}
                    style={styles.inputBoxSend}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    inputBox: {

        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,

        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E5D2FF',
        padding: 10,
        paddingTop: 5,
        marginTop: 3
    },
    inputBoxSend: {
        fontSize: 16,
        padding: 8,
        backgroundColor: '#9f9fff',
        color: '#fff',
        marginLeft: 5
    },
});
export default InputBox;