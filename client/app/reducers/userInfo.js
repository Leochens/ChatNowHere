import { ACTION_USER_LOGIN, ACTION_IN_CHATING, ACTION_OUT_CHATING } from '../constaints';
import ReactSQLite from '../nativeModules/ReactSQLite';

const userinfo = (state = {
    username: '',
    uid: '',
    user_pic: '',
    is_chating: false,
    is_login: false
}, action) => {
    switch (action.type) {
        case ACTION_USER_LOGIN: {   //登录中

        }
        case `${ACTION_USER_LOGIN}_SUC`: { // 登录成功
            const { username, uid, password, user_pic } = action.data;
            ReactSQLite.setUserInfo({ uid, username, password, user_pic });// 登录成功后在sqlite中存储用户信息
            return {
                ...state,
                username,
                uid,
                user_pic,
                is_login: true
            }
        }
        case `${ACTION_USER_LOGIN}_FAI`: { // 登录失败
            // const {msg} = action.data;
            return state;
        }
        case ACTION_IN_CHATING: {
            return {
                ...state,
                is_chating: true
            }
        }
        case ACTION_OUT_CHATING: {
            return {
                ...state,
                is_chating: false
            }
        }
        default: return state;
    }
}

export default userinfo;