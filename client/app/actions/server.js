import * as ACTIONS from '../constaints';

const actionLogin = (data) => {
    const { username,password }= data;

    //TODO 和服务端交互进行登录
    console.log("登录中....");
    return {
        SERVER_API:{
            type: ACTIONS.ACTION_LOGIN,
            endpoint:'/login',
            params: {
                username,
                password
            },
            extra: {
                password
            },
            IS_LOGIN:true
        }
    }
}

const actionFetchChatList = (newChatList, confirm) => {
    return {
        type: ACTIONS.ACTION_FETCH_CHATLIST,
        data: {
            newChatList, confirm
        }
    }
}


const actionLogout = () => {
    return {
        type: ACTIONS.ACTION_LOGOUT
    }
}

export default server = {
    actionLogin,
    actionLogout,
    actionFetchChatList
}