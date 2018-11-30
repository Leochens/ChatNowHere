
import { createStackNavigator } from 'react-navigation';
import GroupChat from './containers/GroupChat';
import Test from './containers/Test';
import Index from './containers/Index';
import Login from './containers/Login';
import Regist from './containers/Regist';
import Main from './containers/Main';
import UserList from './containers/OnlineUsersList';
import ChatList from './containers/ChatList';
import SingleChat from './containers/SingleChat';


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
    UserList: {
        screen: UserList,
        navigationOptions: ({navigation})=>({
            // header: null
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
    GroupChat: {
        screen: GroupChat,
        navigationOptions: ({navigation})=>({
            header: null
        })
    },
    Test: {
        screen: Test,
        navigationOptions: ({navigation}) => ({
            header: null
        })
    }
},
{
    initialRouteName: 'SingleChat',
    headerMode: 'screen'
});

