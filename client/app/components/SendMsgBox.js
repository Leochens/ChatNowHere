import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, TextInput } from 'react-native';
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
                    icon={{
                        name: 'send',
                        size: 16,
                        color: '#fff'
                    }}
                    style={{
                        width: 32,
                        height: 32,
                        padding: 8,
                        borderRadius: 16,
                        textAlign: 'center',
                        borderRadius: 16,
                        color: '#fff',
                        margin: 8,
                        marginRight: 0,
                        backgroundColor: '#9f9fff'
                    }
                    }
                    onClick={this.handleSendMsg}

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
        padding: 8,
    },
});
export default InputBox;