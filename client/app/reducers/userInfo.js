import { ACTION_USER_LOGIN } from '../constaints';


const userinfo = (state = {
    username: '',
    uid: ''
}, action) => {
    switch (action.type) {
        case ACTION_USER_LOGIN: {   //登录中

        }
        case `${ACTION_USER_LOGIN}_SUC`: { // 登录成功
            const { username, uid } = action.data;
            console.log('redux login suc');
            return {
                username,
                uid
            }
        }
        case `${ACTION_USER_LOGIN}_FAI`: { // 登录失败

        }
        default: return state;
    }
}

export default userinfo;