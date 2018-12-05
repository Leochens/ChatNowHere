import { ACTION_GET_RECORD } from '../constaints';
import ReactSQLite from '../nativeModules/ReactSQLite';

/*
    friend_id: msg.from_id,
    friend_name: msg.from_name,
    create_time: msg.create_time,
    content: msg.content,
    send_type: msg.type,// 自己的 1 对方的 2 系统 3
    type: 1, // 文本 1 图片 2
    msg_status: msg.msg_status

*/
const chat = (state={
    chatType:0,
    friendName:'',
    friendId:0,
    friendPic:'',
    myId:0,
    myName:'',
    myPic:'',
    recordList: []
},action)=>{
    switch(action.type){
        case ACTION_GET_RECORD:{
            const {res} = action;
            console.log(res.list);
            return {
                ...state,
                recordList:res.list
            }
        }
        default: return state
    }
}
export default chat;
