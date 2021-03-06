import { ACTION_LOGIN, ACTION_IN_CHATING, ACTION_OUT_CHATING, ACTION_LOGOUT, ACTION_GET_SIDER_BG_IMG, ACTION_SET_SIDER_BG_IMG } from '../constaints';
import ReactSQLite from '../nativeModules/ReactSQLite';


const userinfo = (state = {
    username: '',
    uid: '',
    user_pic: '',
    token: '',
    isChating: false,
    is_login: false,
    siderBgImg: ''
}, action) => {
    switch (action.type) {
        case ACTION_LOGIN: {   //登录中
            return state;
        }
        case `${ACTION_LOGIN}_SUC`: { // 登录成功
            const { username, uid, user_pic, token } = action.response;
            const { password } = action.extra;
            // 建立数据库连接字
            ReactSQLite.createDatabase(`${username}_${uid}.db`); // 给新用户建库
            // 设置用户
            ReactSQLite.setUserInfo({ uid, username, password, user_pic });// 登录成功后在sqlite中存储用户信息
            return {
                ...state,
                username,
                uid,
                user_pic,
                is_login: true,
                token
            }
        }
        case `${ACTION_LOGIN}_FAI`: { // 登录失败
            alert("登录失败");
            return state;
        }

        case ACTION_LOGOUT: {
            return {
                ...state,
                is_login: false
            }
        }

        case `${ACTION_GET_SIDER_BG_IMG}_SUC`: {
            const { bgImg } = action.res;
            return {
                ...state,
                siderBgImg: bgImg
            }
        }
        case ACTION_SET_SIDER_BG_IMG: {
            const { siderBgImg } = action;

            ReactSQLite.setSiderBgImage(siderBgImg);
            return {
                ...state,
                siderBgImg
            };
        }
        default: return state;
    }
}

export default userinfo;