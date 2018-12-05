import { ACTION_GET_CHATLIST } from '../constaints';
import ReactSQLite from '../nativeModules/ReactSQLite';

/*
    friend_id: parseInt(msg.from_id),
    friend_name: msg.from_name,
    friend_pic: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=517389657,4030031755&fm=200&gp=0.jpg',
    last_msg_content: msg.content,
    last_msg_time: msg.create_time,
    new_msg_count: 0
*/
const chatList = (state={
    list: []
},action)=>{
    switch(action.type){
        case ACTION_GET_CHATLIST:{
            const {res} = action;
            console.log(res.list);
            return {
                ...state,
                list:res.list
            }
        }
        default: return state
    }
}
export default chatList;
