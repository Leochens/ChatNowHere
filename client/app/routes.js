
import Chat from './containers/Chat';
import Test from './containers/Test';
import { createStackNavigator } from 'react-navigation';
import Index from './containers/Index';


export default RootStack = createStackNavigator({
    Index: {
        screen: Index,
        navigationOptions: ({navigation})=>({
            header: null
        })
    },
    Chat: {
        screen: Chat,
        navigationOptions: ({navigation})=>({
            header: null
        })
    },
    Test: {
        screen: Test
    }
},
{
    initialRouteName: 'Index',
    headerMode: 'screen'
});
