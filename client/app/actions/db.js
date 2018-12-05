
import * as ACTIONS from '../constaints';


const actionGetChatList = () => {

    return {
        DB_API:{
            type: ACTIONS.ACTION_GET_CHATLIST,
        }
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

export default db = {
    actionGetChatList,
    actionGetRecord
}