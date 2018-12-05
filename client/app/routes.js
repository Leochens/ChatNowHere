
import { createStackNavigator,StackNavigator } from 'react-navigation';
// import GroupChat from './containers/GroupChat/GroupChat';
import Test from './containers/Test/Test';
import Index from './containers/Index/Index';
import Login from './containers/Login/Login';
import Regist from './containers/Regist/Regist';
import Main from './containers/Main/Main';
import ChatList from './containers/ChatList/ChatList';
import SingleChat from './containers/SingleChat/SingleChat';


export default Navs = StackNavigator({
    Index: {
        screen: Index,
        navigationOptions: ({navigation})=>({
            header: null,
            
        }),
    },

    ChatList: {
        screen: ChatList,
        navigationOptions: ({navigation})=>({
            header: null
        })
    },
    SingleChat: {
        screen: SingleChat,
        navigationOptions: ({navigation})=>({
            header: null
        })
    },
    Main: {
        screen: Main,
        navigationOptions: ({navigation})=>({
            header: null
        })
    },
    Login: {
        screen: Login,
        navigationOptions: ({navigation})=>({
            header: null
        })
    },
    Regist: {
        screen: Regist,
        navigationOptions: ({navigation})=>({
            header: null
        })
    },
    // GroupChat: {
    //     screen: GroupChat,
    //     navigationOptions: ({navigation})=>({
    //         header: null
    //     })
    // },
    Test: {
        screen: Test,
        navigationOptions: ({navigation}) => ({
            header: null
        })
    }
}, {
    
    initialRouteName: 'Login', // 默认显示界面
    navigationOptions: {  // 屏幕导航的默认选项, 也可以在组件内用 static navigationOptions 设置(会覆盖此处的设置)
        header: {  // 导航栏相关设置项
            backTitle: '返回',  // 左上角返回键文字
            style: {
                backgroundColor: '#fff'
            },
            titleStyle: {
                color: 'green'
            }
        },
        cardStack: {
            gesturesEnabled: true
        }
    }, 
    mode: 'card',  // 页面切换模式, 左右是card(相当于iOS中的push效果), 上下是modal(相当于iOS中的modal效果)
    headerMode: 'screen', // 导航栏的显示模式, screen: 有渐变透明效果, float: 无透明效果, none: 隐藏导航栏
    onTransitionStart: ()=>{ console.log('导航栏切换开始'); },  // 回调
    onTransitionEnd: ()=>{ console.log('导航栏切换结束'); }  // 回调
});

// export default RootStack = createStackNavigator({
    
// },
// {
//     initialRouteName: 'Login',
//     headerMode: 'screen'
// });

