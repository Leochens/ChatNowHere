import React,{Component } from 'react';
import {Text,View,TouchableHighlight,TextInput,Button,StyleSheet,FlatList,TouchableOpacity} from 'react-native';
 class FlatListTest extends Component {


    toIndex = () => {
        fetch('http://mokis.top:3001/userlogin',{
            method: 'POST',
            headers:{
                "Content-Type": 'application/x-www-form-urlencoded'
            },
            // body: `data=${JSON.stringify({name: 'zhl',pwd: '123456'})}`
            body: `name=zhl&pwd=${1}`
        }).then(res => {
            console.log(res);
            alert(res);
        }).catch(err => {
            console.log(err);
            alert(err)
        });
        alert('haha?')
    }

    render(){
        return (
            <View>
                <Button
                title="toEnd"
                    onPress={this.toIndex}/>
            </View>
        );
    }

 }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 22
    },
    item: {
      padding: 10,
      fontSize: 55,

    },
  })
  
export default FlatListTest;