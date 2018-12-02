import React, { Component } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ToastAndroid,
    BVLinearGradient
} from 'react-native';

import { NativeModules } from 'react-native';
import { connect } from 'react-redux';

class Index extends Component {

    render() {
        console.log(this.props);
        return (
            <View>
                <Text>hello</Text>
            </View>
        )
    }
}
const styles = StyleSheet.create({


});

const mapStateToProps = state => {
    return {
        v: state.test.v
    }
}
export default connect(mapStateToProps)(Index);
