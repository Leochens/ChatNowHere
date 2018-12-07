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
        ],
        showBack: true
    }
    renderMore = () => {
    }
    renderBack = () => {
        const { showBack, moreOptions } = this.props;
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
    onOptionPressed = action => {
        action && action();
        this.hideMoreOptions();
    }
    renderMoreOptions = () => {
        const { moreOptions } = this.props;
        if (!this.state.isMoreActive || !Array.isArray(moreOptions) || !moreOptions.length)
            return null;


        const options = moreOptions.map((item, idx) =>
            <Text style={{
                width: 160,
                height: 48,
                padding: 8,
                borderRadius: 8,
                backgroundColor: '#fff',
                borderBottomColor: '#ccc',
                borderBottomWidth: 1,
                textAlign: 'center',
                lineHeight: 48,
            }} key={idx} onPress={() => this.onOptionPressed(item.onPress)}>{item.title}</Text>);
        return (
            <View onPress={this.hideMoreOptions}>
                {options}
            </View>
        )
    }
    renderMask = () => {
        const { moreOptions } = this.props;
        if (!moreOptions && !moreOptions.length)
            return null;
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
                zIndex: 100
            }}>
            <Text style={{
                width: 80,
                height: 48,
                backgroundColor: '#a00',
                position: 'absolute',
                bottom: '10%',
                borderRadius: 40,
                alignSelf: 'center',
                textAlign: 'center',
                lineHeight: 48,
                color: '#fff',
                fontWeight: '500'
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
                    zIndex:2
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
                        onPress={moreOptions && moreOptions.length ? this.showMoreOptions : null}
                        name="ellipsis-h" size={16} color="#fff" />
                    <View style={{
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