import { ACTION_GET_CHATLIST, ACTION_CLEAR_NEW_MSG_COUNT, ACTION_UPDATE_RECORD, ACTION_UPDATE_CHATLIST, ACTION_FETCH_CHATLIST, ACTION_RECEIVE_MSG, ACTION_DELETE_FRIEND_RECORD } from '../constaints';
import ReactSQLite from '../nativeModules/ReactSQLite';
import {ToastAndroid} from 'react-native';
import { msgMapToChatItem, msgMapToLocalRecord } from '../utils/formatMap';
/*
    friend_id: parseInt(msg.from_id),
    friend_name: msg.from_name,
    friend_pic: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=517389657,4030031755&fm=200&gp=0.jpg',
    last_msg_content: msg.content,
    last_msg_time: msg.create_time,
    new_msg_count: 0
*/
const chatList = (state = {
    list: []
}, action) => {
    switch (action.type) {
        case `${ACTION_GET_CHATLIST}_SUC`: {
            const { res } = action;
            console.log(res.list);
            return {
                ...state,
                list: res.list
            }
        }
        case ACTION_CLEAR_NEW_MSG_COUNT: {
            const { friend_id } = action;
            const list = state.list.slice();
            list.forEach((item, idx) => {
                if (item.friend_id === friend_id) {
                    list[idx] = {
                        ...list[idx],
                        new_msg_count: 0
                    }
                }
            })
            ReactSQLite.clearUnreadMsgCount(friend_id);
            return {
                ...state,
                list
            }
        }
        case ACTION_UPDATE_RECORD: {
            const { msg } = action;
            ToastAndroid.show(`${msg.friend_name}:${msg.content}`,ToastAndroid.SHORT);
            ReactSQLite.addMsg(msg);

        }
        case ACTION_UPDATE_CHATLIST: {
            // alert(action.data);
            if (!action.data)
                return state;
            const { msg: localChatItem, isChating } = action.data;

            console.log(localChatItem, action);
            const list = state.list.slice();
            const idMap = {};
            let friend_ids = list.map(chatItem => chatItem.friend_id); // 获得当前消息列表中用户的每个用户的id
            list.forEach((chatItem, idx) => { idMap[chatItem.friend_id] = idx });// 建立用户id和当前数组id的映射关系 方便查找
            if (friend_ids.includes(localChatItem.friend_id)) {
                const indexOfTargetChatItem = idMap[localChatItem.friend_id];
                const { new_msg_count } = list[indexOfTargetChatItem];
                const newItem = {
                    ...localChatItem,
                    new_msg_count: /*isChating ? 0 :*/ new_msg_count + 1
                };
                console.log('tmp', newItem);
                list[indexOfTargetChatItem] = newItem;
                ReactSQLite.updateChatListItem(newItem);

            } else {
                list.push({
                    ...localChatItem,
                    new_msg_count: 1
                });
                ReactSQLite.updateChatListItem({
                    ...localChatItem,
                    new_msg_count: 1
                });
            }
            return {
                ...state,
                list
            }
        }
        case ACTION_FETCH_CHATLIST: {
            const { newChatList, confirm } = action.data;
            console.log(newChatList);
            console.log('new fetch newChatList');
            const chatList = this.getCleanChatList(state.list.slice(), newChatList);


            // 将拉取得未读消息存入sqlite
            const localFormatChatList = newChatList.map(item => msgMapToLocalRecord(item));
            ReactSQLite.addMsgList(localFormatChatList);
            confirm(); //用户收到信息后回调它告诉服务端确认成功

            return {
                ...state,
                list: chatList
            }
        }

        case ACTION_DELETE_FRIEND_RECORD: {
            const {friend_id} = action;
            const list= state.list.slice();
            let idx = -1;
            list.forEach((item,id)=>{
                if(item.friend_id === friend_id){
                    idx = id;
                }
            })
            if(idx===-1)
                return state;
            
            list.splice(idx,1);

            ReactSQLite.deleteFriendRecords(friend_id);
            return {
                ...state,
                list
            }
        }

        default: return state
    }

}
export default chatList;


getCleanChatList = (oldList, list) => {
    const chatList = oldList;
    const idMap = {};
    let friend_ids = chatList.map(msg => msg.friend_id); // 获得当前消息列表中用户的每个用户的id

    console.log("getCleanChatList", list);

    list.forEach(msg => {
        friend_ids = chatList.map(chatItem => chatItem.friend_id); // 获得当前消息列表中用户的每个用户的id
        chatList.forEach((chatItem, idx) => { idMap[chatItem.friend_id] = idx });// 建立用户id和当前数组id的映射关系 方便查找 
        if (friend_ids.includes(msg.from_id)) { // 如果当前列表中有该用户发的消息，那么就覆盖该消息，并把消息数加一
            const newItem = {
                ...msgMapToChatItem(msg),
                new_msg_count: chatList[idMap[msg.from_id]].new_msg_count + 1
            };
            chatList[idMap[msg.from_id]] = newItem;
            ReactSQLite.updateChatListItem(newItem);

            console.log("覆盖原来的好友" + newItem.friend_name + "的消息,当前用户的未读消息", newItem.new_msg_count);
        } else {   // 如果没有就添加该消息到消息列表
            console.log("添加新的好友消息");
            chatList.push({ ...msgMapToChatItem(msg), new_msg_count: 1 });
            ReactSQLite.updateChatListItem({ ...msgMapToChatItem(msg), new_msg_count: 1 });
        }
    });
    return chatList;
}