import React, { Component } from 'react';
import { Text, View, StyleSheet, Dimensions, TextInput, FlatList, Animated } from 'react-native';
import ZButton from './ZButton';
import axios from 'axios';
import config from '../config';

class ResultItem extends Component {

    toChat = () => {
        const { data } = this.props;
        const _data = {
            friend_id: data.id,
            friend_name: data.username,
            friend_pic: data.user_pic
        }
        const { navigate } = this.props;
        navigate("SingleChat", { data: _data })
    }

    render() {
        const { data } = this.props;
        return (
            <View style={{
                width: '100%',
                height: 48,
                borderTopWidth: 1,
                borderTopColor: '#ddd',
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>
                <Text style={{
                    padding: 8,
                    fontSize: 16,


                }}>{data.username}</Text>
                <ZButton
                    onClick={this.toChat}
                    style={{
                        width: 32,
                        margin: 8
                    }}
                    icon={{
                        name: 'plus',
                        color: '#fff',
                        size: 8
                    }} />
            </View>
        );
    }
}
export default class TabBar extends Component {

    state = {
        isPaneActive: false,
        username: '',
        userlist: [],
        opacity: new Animated.Value(0)
    }

    showPane = () => {
        Animated.timing(
            this.state.opacity, {
                toValue: 0.6,
                duration: 300
            }
        ).start();

        this.setState({
            isPaneActive: true,
        });
    }



    hidePane = () => {
        Animated.timing(
            this.state.opacity, {
                toValue: 0,
                duration: 500
            }
        ).start();
        this.setState({
            isPaneActive: false,
            username: '',
            userlist: [],
            opacity: new Animated.Value(0)
        });
    }
    getUsername = username => {
        this.setState({
            username
        })
    }
    getMessage = message => {
        this.setState({
            message
        })
    }
    renderMask = () => {
        const { isPaneActive } = this.state;
        if (!isPaneActive) return null;
        return (
            <Animated.View
                style={{
                    position: 'absolute',
                    zIndex: 4,
                    top: -Dimensions.get('window').height,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: '#000',
                    opacity: this.state.opacity
                }} />
        );
    }

    renderBtn = () => {
        const { isPaneActive } = this.state;
        return (
            <ZButton
                onClick={isPaneActive ? this.hidePane : this.showPane}
                icon={{
                    name: isPaneActive ? 'close' : 'plus',
                    color: isPaneActive ? '#a00' : '#9f9fff',
                    size: 24
                }}
                style={{

                    width: '100%',
                    height: 48,
                    borderTopColor: '#eee',
                    borderTopWidth: 0.5,
                    backgroundColor: '#fff',
                    borderRadius: 0,
                    zIndex: 5
                }}
            />
        );
    }
    onBtnClick = () => {
        const { username } = this.state;
        const { action } = this.props;

        if (!username) {
            alert("请输入完成");
            return;
        }

        // action && action(username,message);
        axios(`${config.host}:${config.port}/dbtest/search/${username}`, {
            method: 'GET',
        }).then(res => {
            if (res.data.code === 200) {
                console.log("成功 搜索结果", res.data.list);
                this.setState({
                    userlist: res.data.list
                })
            }
            else {
                console.log("失败", res.data.msg);
            }
        }).catch(err => console.log(err))

    }
    renderUsers = () => {
        const { userlist } = this.state;
        const { action, navigate } = this.props;

        return (
            <FlatList
                style={{
                    width: Dimensions.get('window').width,
                    zIndex: 5

                }}
                ListEmptyComponent={<Text style={{ width: '100%', height: '100%', textAlign: 'center' }}>无匹配项</Text>}
                data={userlist}
                renderItem={({ item }) => (<ResultItem
                    navigate={navigate} data={item}
                />)}
            />
        );
    }
    renderPane = () => {
        const { isPaneActive, userlist } = this.state;
        const { action, navigate } = this.props;

        if (!isPaneActive)
            return null;
        return (
            <View style={{
                borderRadius: 8,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                position: 'absolute',
                top: userlist.length ? -Dimensions.get('window').height / 2 : -80,
                bottom: 48,
                left: 0,
                right: 0,
                zIndex: 5,

                alignItems: 'center',
                backgroundColor: '#fff'
            }}>
                <View style={{ flexDirection: 'row' }}>

                    <View style={{
                        flex: 1
                    }}>
                        <TextInput
                            placeholder={'搜索用户'}
                            onChangeText={this.getUsername}
                            onSubmitEditing={this.onBtnClick}
                            style={{
                                padding: 8,
                                // width: 160,
                                height: 48,
                                flex: 1,
                                borderColor: '#eee'
                            }} />

                    </View>
                    <View >
                        <ZButton
                            icon={{
                                name: 'search',
                                size: 24,
                                color: '#fff'
                            }}
                            onClick={this.onBtnClick}
                            style={{
                                // marginLeft: 100
                            }}
                        />
                    </View>
                </View>
                {this.renderUsers()}
            </View>
        );
    }
    render() {
        return (
            <View>
                {this.renderMask()}
                {this.renderPane()}
                {this.renderBtn()}
            </View>
        );
    }
}