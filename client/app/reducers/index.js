import { combineReducers } from 'redux';
import userinfo from './userInfo';
const test = (state = {
    v: 16
}, action) => {
    return state;
}



export default combineReducers({
    test,
    userinfo
});