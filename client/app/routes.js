
import { createStackNavigator } from 'react-navigation';
// import GroupChat from './containers/GroupChat/GroupChat';
import Test from './containers/Test/Test';
import Index from './containers/Index/Index';
import Login from './containers/Login/Login';
import Regist from './containers/Regist/Regist';
import Main from './containers/Main/Main';
import ChatList from './containers/ChatList/ChatList';
import SingleChat from './containers/SingleChat/SingleChat';


export default RootStack = createStackNavigator({
    Index: {
        screen: Index,
        navigationOptions: ({navigation})=>({
            header: null
        })
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
},
{
    initialRouteName: 'Login',
    headerMode: 'screen'
});

