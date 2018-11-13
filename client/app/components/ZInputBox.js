import React, { Component } from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';


class ZInputBox extends Component {


    handleChangeText = v => {
        const { onChangeText } = this.props;
        onChangeText && onChangeText(v);
    }
    render() {
        const {
            style: pStyle,
            value,
            secureTextEntry,
            textContentType,
            placeholder,
            placeholderTextColor
        } = this.props;
        return (
            <TextInput
                placeholder={placeholder}
                placeholderTextColor={placeholderTextColor}
                onChangeText={this.handleChangeText}
                secureTextEntry={secureTextEntry}
                textContentType={textContentType}
                value={value}
                style={[styles.inputBox, pStyle]}
                value={value} />
        )
    }
}
const styles = StyleSheet.create({
    inputBox: {
        flex: 1,
        fontSize: 18,
        borderColor: '#ddd',
        borderRadius: 6,
        borderWidth: 1,
        padding: 6,
        minHeight: 45

    }
});
export default ZInputBox;