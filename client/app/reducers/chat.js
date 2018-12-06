import { ACTION_GET_RECORD, ACTION_UPDATE_RECORD, ACTION_IN_CHATING, ACTION_OUT_CHATING, ACTION_LOGIN, ACTION_GET_MORE_RECORD } from '../constaints';
import ReactSQLite from '../nativeModules/ReactSQLite';
import { msgMapToLocalRecord } from '../utils/formatMap';
/*
    friend_id: msg.from_id,
    friend_name: msg.from_name,
    create_time: msg.create_time,
    content: msg.content,
    send_type: msg.type,// 自己的 1 对方的 2 系统 3
    type: 1, // 文本 1 图片 2
    msg_status: msg.msg_status

*/
const chat = (state = {
    chatType: 0,
    friendName: '',
    friendId: 0,
    friendPic: '',
    myId: 0,
    myName: '',
    myPic: '',
    recordList: [],
    isChating: false
}, action) => {
    switch (action.type) {
        case `${ACTION_GET_RECORD}_SUC`: {
            const { res } = action;
            console.log(res.list);
            res.list.reverse();
            return {
                ...state,
                recordList: res.list
            }
        }
        case `${ACTION_GET_MORE_RECORD}_SUC`: {
            const { res } = action;
            const {recordList} = state;
            console.log(res.list);
            res.list.reverse();

            return {
                ...state,
                recordList: res.list.concat(recordList)
            }
        }
        
        case `${ACTION_LOGIN}_SUC`: {
            const { username, uid, user_pic, token } = action.response;
            return {
                ...state,
                myName: username,
                myPic: user_pic,
                myId: uid
            }
        }
        case ACTION_UPDATE_RECORD: {
            const { msg } = action;

            console.log("新收到消息", msg);
            if (!state.isChating
                || (state.friendId != msg.friend_id)
            )
                return state;


            const recordList = state.recordList.slice();
            recordList.push(msg);
            return {
                ...state,
                recordList
            }

        }
        case ACTION_IN_CHATING: {
            const {friend_name,friend_id,friend_pic} = action.data;
            return {
                ...state,
                friendName:friend_name,
                friendId:friend_id,
                friendPic:friend_pic,
                isChating: true
            }
        }
        case ACTION_OUT_CHATING: {
            return {
                ...state,
                isChating: false,
                recordList: []
            }
        }

        default: return state
    }
}
export default chat;
