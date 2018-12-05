import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


class ZButton extends Component {

    onBtnClick = () => {
        const { onClick } = this.props;
        // alert(onClick);
        onClick && onClick();
    }
    renderIcon = () => {
        const { icon } = this.props;
        if (!icon)
            return null;
        return <FontAwesome style={{ color: icon.color }} name={icon.name} size={icon.size} />

    }
    renderText = () => {
        const {text} = this.props;
        if(!text)
            return null;
        return <Text style={{color:'#fff'}}>{text}</Text>
    }
    render() {
        const { style: pStyle } = this.props;
        return (

            <TouchableOpacity
                style={[{
                    padding: 8,
                    width: 48,
                    textAlign: 'center',
                    borderRadius: 8,
                    color: '#fff',
                    backgroundColor: '#9f9fff',
                    alignSelf:'center',
                    justifyContent:'center',
                    alignItems: 'center'
                }, pStyle]}
                onPress={this.onBtnClick}>
                {this.renderIcon()}
                {this.renderText()}
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