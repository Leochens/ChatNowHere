import React,{Component} from 'react';


import {Text,StyleSheet} from 'react-native';
import ZButton from './ZButton';

export default class MoreButton extends Component{

    render(){
        return (
            <ZButton 
            // style={}
            onClick={this.props.onClick}
            text={this.props.text}/>
        );
    }
}

const styles = StyleSheet.create({


});