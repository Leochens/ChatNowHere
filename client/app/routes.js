
import { createStackNavigator } from 'react-navigation';
import GroupChat from './containers/GroupChat';
import Test from './containers/Test';
import Index from './containers/Index';
import Login from './containers/Login';
import Regist from './containers/Regist';

export default RootStack = createStackNavigator({
    Index: {
        screen: Index,
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
    GroupChat: {
        screen: GroupChat,
        navigationOptions: ({navigation})=>({
            header: null
        })
    },
    Test: {
        screen: Test
    }
},
{
    initialRouteName: 'Login',
    headerMode: 'screen'
});
