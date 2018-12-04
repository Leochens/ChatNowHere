import React, { Component } from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
class NavBar extends Component {
    state = {
        isMoreActive: false
    }
    static defaultProps = {
        title: '标题',
        backAction: () => { },
        moreOptions: [
            {
                title: '测试',
                onPress: () => { alert('测试'); }
            },
            {
                title: '测试',
                onPress: () => { alert('测试'); }
            },            {
                title: '测试',
                onPress: () => { alert('测试'); }
            },
        ],
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
            : <View style={{ width: 16, height: 16 }}></View>
    }

    showMoreOptions = () => {
        this.setState({
            isMoreActive: true
        })
    }
    hideMoreOptions = () => {
        this.setState({
            isMoreActive: false
        })
    }
    renderMoreOptions = () => {
        const { moreOptions } = this.props;
        if (!this.state.isMoreActive || !Array.isArray(moreOptions) || !moreOptions.length)
            return null;


        const options = moreOptions.map((item, idx) =>
            <Text style={{
                width: 160,
                height: 48,
                padding:8,
                borderRadius:8,
                backgroundColor: '#fff',
                borderBottomColor:'#ccc',
                borderBottomWidth:1,
                textAlign: 'center',
                lineHeight: 48,
            }} key={idx} onPress={item.onPress}>{item.title}</Text>);
        return (
            <View onPress={this.hideMoreOptions}>
                {options}
            </View>
        )
    }
    renderMask = () => {

        if (!this.state.isMoreActive)
            return null;
        const { height, width } = Dimensions.get('window');

        return <View
            style={{
                position: 'absolute',
                bottom: 0,
                top: 0,
                left: 0,
                right: 0,
                height,
                width,
                backgroundColor: '#000',
                opacity: 0.6,
                zIndex: 2
            }}>
            <Text style={{
                width: 80,
                height: 48,
                backgroundColor: '#7367F0',
                position: 'absolute',
                bottom: '10%',
                borderRadius: 40,
                alignSelf: 'center',
                textAlign: 'center',
                lineHeight:48,
                color:'#fff',
                fontWeight:'500'
            }} onPress={this.hideMoreOptions}>X</Text>
        </View>
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
                {this.renderMask()}
                <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                }}>
                    {this.renderBack()}
                    <Text style={{
                        color: '#fff',
                        fontSize: 16,
                        flex: 1,
                        textAlign: 'center'
                    }}>{title}</Text>
                    <FontAwesome
                        onPress={this.showMoreOptions}
                        name="ellipsis-h" size={16} color="#fff" />
                    <View style={{
                        // width: 160,
                        // height: 300,
                        // backgroundColor: "#0f0",
                        position: 'absolute',
                        top: 10,
                        right: 0,
                        zIndex: 3
                    }}>
                        {this.renderMoreOptions()}

                    </View>
                </View>

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