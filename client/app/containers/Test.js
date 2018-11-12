import React,{Component } from 'react';
import {Text,View,TouchableHighlight,TextInput,Button,StyleSheet,FlatList,TouchableOpacity} from 'react-native';
 class FlatListTest extends Component {


    toIndex = () => {
        this.refs.fl.scrollToEnd();
    }

    render(){
        return (
            <View>
                <Button
                title="toEnd"
                    onPress={this.toIndex}/>
                <FlatList
                ref="fl"
                data={[1,2,3,4,5,5,6,7,8,9,10,11,12,13]}
                renderItem={({item})=><Text style={styles.item}>{item}</Text>}
                />
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