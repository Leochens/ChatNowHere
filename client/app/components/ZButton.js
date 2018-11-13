import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';


class ZButton extends Component {

    onBtnClick = () => {
        const { onClick } = this.props;
        onClick && onClick();
    }
    render() {
        const { style: pStyle, text,width,align } = this.props;
        return (
            <TouchableOpacity
                style={{width,alignSelf: align}}
                onPress={this.onBtnClick}>
                <Text
                    style={[styles.btn, pStyle]}>
                    {text}
                </Text>
            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    btn: {
        paddingTop: 7,
        paddingBottom: 7,
        paddingLeft: 4,
        paddingRight: 4,
        textAlign:'center',
        borderRadius: 10,
        color: '#fff',
        backgroundColor: '#9f9fff',
    }
});
export default ZButton;