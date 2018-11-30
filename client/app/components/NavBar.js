import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
class NavBar extends Component {

    static defaultProps = {
        title: '标题',
        backAction: () => { },
        moreOptions: {},
        showBack: true
    }

    renderMore = () => {
    }
    renderBack = () => {
        const { showBack } = this.props;
        return showBack
            ?
            <View>
                <FontAwesome name='backward' size={16} color="#fff" />
            </View>
            : <View style={{width:16,height: 16}}></View>
    }
    render() {
        const {
            title,
            backAction,
            moreOptions
        } = this.props;
        return (
            <LinearGradient
                colors={['#CE9FFC', '#7367F0']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0.5 }}
                style={{
                    padding: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    // height: 48
                }}  >
                {this.renderBack()}

                <Text style={{
                    color: '#fff',
                    fontSize: 16,
                    flex: 1,
                    textAlign: 'center'
                }}>{title}</Text>
                <FontAwesome name="ellipsis-h" size={16} color="#fff" />
            </LinearGradient>
        );
    }
}

const styles = StyleSheet.create({
    nav: {
        height: 48,
        padding: 16,

    }
})
export default NavBar;