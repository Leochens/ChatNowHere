import React,{Component} from 'react';
import {View,Text,StyleSheet,TouchableHighlight,TextInput} from 'react-native';

class InputBox extends Component {
    state = {
        v: ''
    }
    handleChangeText = v => {
        this.setState({
            v
        });
        console.log(v);
    }
    handleSendMsg = () => {
        console.log('Input Box hit Send Button Onpress');
        const { onSendMsg } = this.props;
        onSendMsg && onSendMsg(this.state.v);
        this.setState({
            v: ''
        })
    }
    render() {
        return (
            <View style={styles.inputBox}>
                <TextInput
                    onChangeText={this.handleChangeText}
                    value={this.state.v}
                    style={styles.inputBoxInput}></TextInput>
                <TouchableHighlight
                    onPress={this.handleSendMsg}>
                    <Text style={styles.inputBoxSend}>发送</Text>
                </TouchableHighlight>
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
        // backgroundColor: '#fff',
        padding: 10

    },
    inputBoxInput: {
        flex: 1,
        borderColor: '#ddd',
        borderRadius: 3,
        borderWidth: 1,
        padding: 3,
    },
    inputBoxSend: {
        fontSize: 15,
        padding: 8,
        backgroundColor: '#9f9fff',
        color: '#fff'
    },
});
export default InputBox;