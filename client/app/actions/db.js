
import * as ACTIONS from '../constaints';


const actionGetChatList = () => {

    return {
        DB_API:{
            type: ACTIONS.ACTION_GET_CHATLIST,
        }
    }
}

const actionUpdateChatList = (data) => {
    return {
        type: ACTIONS.ACTION_UPDATE_CHATLIST,
        data
    }
}

const actionGetRecord = friend_id => {

    return {
        DB_API:{
            type: ACTIONS.ACTION_GET_RECORD,
            params: {
                friend_id
            }
        }
    }
}


const actionGetMoreRecord = (friend_id,initId) => {

    return {
        DB_API:{
            type: ACTIONS.ACTION_GET_MORE_RECORD,
            params: {
                friend_id,
                initId
            }
        }
    }
}

export const actionUpdateRecord = (msg) => {
    return{
        type: ACTIONS.ACTION_UPDATE_RECORD,
        msg
    }
}


export const actionReceiveMsg = (msg,confirm) => {
    return{
        type: ACTIONS.ACTION_RECEIVE_MSG,
        data:{
            msg,
            confirm
        }
    }
}


export default db = {
    actionGetChatList,
    actionGetRecord,
    actionUpdateRecord,
    actionUpdateChatList,
    actionReceiveMsg,
    actionGetMoreRecord
}