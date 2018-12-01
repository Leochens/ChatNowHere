import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


class ZButton extends Component {

    onBtnClick = () => {
        const { onClick } = this.props;
        onClick && onClick();
    }
    render() {
        const { style: pStyle, text, width, align } = this.props;
        return (

            <TouchableOpacity
                style={{
                    width: 32,
                    height: 32,
                    padding: 8,
                    borderRadius: 16,
                    textAlign: 'center',
                    borderRadius: 16,
                    color: '#fff',
                    margin: 8,
                    marginRight:0,
                    backgroundColor:'#9f9fff'
                }}
                onPress={this.onBtnClick}>
                <FontAwesome style={{color:'#fff'}} name="send" size={16} />
            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    btn: {

        // backgroundColor: '#9f9fff',
    }
});
export default ZButton;