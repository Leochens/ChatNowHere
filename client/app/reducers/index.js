import { combineReducers } from 'redux';
import userinfo from './userInfo';
import ui from './ui';
import chatList from './chatList';
import chat from './chat';
const test = (state = {
    v: 16
}, action) => {
    return state;
}



export default combineReducers({
    test,
    userinfo,
    ui,
    chatList,
    chat
});