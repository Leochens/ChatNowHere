import React, { Component } from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';


class ZInputBox extends Component {


    handleChangeText = v => {
        const { onChangeText } = this.props;
        onChangeText && onChangeText(v);
    }
    render() {
        const { style: pStyle, value } = this.props;
        return (
            <TextInput
                onChangeText={this.handleChangeText}
                value={value}
                style={[styles.inputBox,pStyle]} 
                value={value}/>
        )
    }
}
const styles = StyleSheet.create({
    inputBox: {
        flex: 1,
        borderColor: '#ddd',
        borderRadius: 3,
        borderWidth: 1,
        padding: 3,
    }
});
export default ZInputBox;