import React, { Component } from 'react';
import { Text, View, StyleSheet, TextInput, ToastAndroid, ImageBackground, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ActionCreators from '../../actions';
import ImagePicker from 'react-native-image-picker';
import ZButton from '../../components/ZButton';
class Slider extends Component {
    state = {
        isEditingCity: false,
        city: '',
        // bg: 'https://images2017.cnblogs.com/blog/804440/201712/804440-20171201150548758-773795005.png'
    }
    componentDidMount() {
        const { actionGetWeather, actionGetSiderBgImg } = this.props;
        const initCity = '保定';
        actionGetWeather({ version: 'v1', city: initCity });
        actionGetSiderBgImg();
        this.setState({
            city: initCity
        })
    }
    editCity = () => {
        this.setState({
            isEditingCity: true
        })
    }
    editingCity = newCity => {
        this.setState({
            city: newCity
        })
    }
    handleChangeCity = () => {
        const { actionGetWeather } = this.props;
        const { city } = this.state;
        actionGetWeather({ version: 'v1', city });
        ToastAndroid.show("已经更改城市" + city, ToastAndroid.SHORT);
        this.setState({
            isEditingCity: false
        })
    }
    renderCity = () => {
        const { isEditingCity } = this.state;
        const { weather: { city } } = this.props;
        if (isEditingCity) {
            return (<TextInput
                style={{
                    fontSize: 32,
                    color: '#a00',
                    width: 128
                }}
                onSubmitEditing={this.handleChangeCity}
                onChangeText={this.editingCity}
                value={this.state.city}
                placeholder={"新的城市名"} />)
        }
        return (
            <Text
                ellipsizeMode={'tail'}
                onLongPress={this.editCity}
                style={{
                    fontSize: 32
                }}>{city}</Text>
        )
    }
    renderWeather = () => {
        const {
            weather: {
                city,
                cityid,
                data,
                update_time
            }
        } = this.props;
        const today = data[0];
        return (
            <View >
                <View>
                    <Text style={{ fontSize: 8, color: '#666' }}>长按即可更改城市</Text>
                </View>
                <View style={{
                    // marginTop: 32,
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <View style={{
                        // padding:16,
                        paddingLeft: 0
                    }}>
                        {this.renderCity()}
                    </View>
                    <View style={{
                        padding: 16,
                    }}>
                        <Text style={{
                            fontSize: 12
                        }}>空气指数:{today.air}</Text>
                        <Text style={{
                            fontSize: 12
                        }}>空气指标:{today.air_level}</Text>
                        {/* <Text>{today.air_tips}</Text> */}
                    </View>
                </View>

                {/* <Text>{today.alarm.alarm_type}</Text> */}
                {/* <Text>{today.alarm.alarm_level}</Text> */}
                {/* <Text>{today.alarm.alarm_content}</Text> */}
                <View style={{
                    // flexDirection:'row'
                }}>
                    <Text style={{
                        fontSize: 24
                    }}>{today.wea}</Text>
                    <Text style={{
                        fontSize: 16,
                        marginTop: 8
                    }}>{today.tem1} ~ {today.tem2}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ marginRight: 8 }}>{today.date}</Text>
                    <Text>{today.week}</Text>
                </View>


            </View>
        );
    }
    selectPhoto = () => {
        const { actionSetSiderBgImg } = this.props;
        ImagePicker.showImagePicker({
            title: '上传头像',
            quality: 1,
            maxHeight: 300,
            maxWidth: 300,
            takePhotoButtonTitle: '现场拍一张',
            chooseFromLibraryButtonTitle: '从相册选择',
            cancelButtonTitle: '取消上传',
            storageOptions: {
                skipBackup: true
            }
        }, res => {
            if (res.didCancel) {
                console.log("用户取消")
            } else if (res.error) {
                console.log("上传出现错误");
            } else if (res.customButton) {
                console.log("用户 custom button");
            } else {
                console.log(res)
                // // qiniu.upload(res.uri,res.fileName,)
                // this.setState({
                //     bg: res.uri
                // });
                actionSetSiderBgImg(res.uri); // 将用户设置的背景图存下来

            }

        })
    }
    render() {
        const { width, height } = Dimensions.get('window');
        return (
            <ImageBackground
                resizeMode={'cover'}
                style={{
                    width,
                    height,
                    backgroundColor: '#fff',
                    paddingLeft: 16,
                    paddingTop: 32,
                }}
                source={{ uri: this.props.siderBgImg }}>
                {this.renderWeather()}
                <ZButton
                    style={{
                        backgroundColor: 'transparent',
                        width: 100,
                        borderWidth: 1,
                        borderColor: '#eee',
                        borderRadius: 8,
                        alignSelf:'flex-start',
                        marginTop: 24

                    }}
                    onClick={this.selectPhoto}
                    text={"更换背景图"}></ZButton>

            </ImageBackground>

        )
    }
}


const mstp = state => {
    return {
        weather: state.weather,
        siderBgImg: state.userinfo.siderBgImg
    }
}
const mdtp = dispatch => {
    return {
        actionGetWeather: bindActionCreators(ActionCreators.server.actionGetWeather, dispatch),
        actionGetSiderBgImg: bindActionCreators(ActionCreators.db.actionGetSiderBgImg, dispatch),
        actionSetSiderBgImg: bindActionCreators(ActionCreators.db.actionSetSiderBgImg, dispatch),
    }
}
export default connect(mstp, mdtp)(Slider);