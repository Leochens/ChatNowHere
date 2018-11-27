
import React, { Component } from 'react';
import { View, FlatList, Text } from 'react-native';
export default class Main extends Component {

    render() {
        const data = this.props.navigation.getParam('users');
        return (
            <View style={
                {
                    height: '100%',
                    width: '100%'
                }
            }>
                <FlatList data={data}
                    ListHeaderComponent={<View>
                        <Text style={{
                            flex: 1,
                            textAlign: 'center',
                            fontSize: 20,
                            fontWeight: '500',
                            

                        }}>当前在线用户|{data.length}人</Text>
                    </View>}
                    renderItem={({ item }) => (<Text style={{
                        padding: 10,
                        fontSize: 18,
                        borderBottomWidth: 1,
                        borderBottomColor: '#ccc'
                    }}>{item}</Text>)}
                />
            </View>
        );
    }
}

