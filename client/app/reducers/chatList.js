import { ACTION_GET_CHATLIST, ACTION_CLEAR_NEW_MSG_COUNT, ACTION_UPDATE_RECORD, ACTION_UPDATE_CHATLIST } from '../constaints';
import ReactSQLite from '../nativeModules/ReactSQLite';
import {msgMapToChatItem,msgMapToLocalRecord} from '../utils/formatMap';
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
        case ACTION_GET_CHATLIST: {
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
            list.forEach(item => {
                if (item.friend_id === friend_id) {
                    item = {
                        ...item,
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
            ReactSQLite.addMsg(msg);

        }
        case ACTION_UPDATE_CHATLIST: {
            // alert(action.data);
            if(!action.data)
                return state;
            const { msg:localChatItem,is_chating } = action.data;

            console.log(localChatItem);
            const list = state.list.slice();
            const idMap = {};
            let friend_ids = list.map(chatItem => chatItem.friend_id); // 获得当前消息列表中用户的每个用户的id
            list.forEach((chatItem, idx) => { idMap[chatItem.friend_id] = idx });// 建立用户id和当前数组id的映射关系 方便查找
            if (friend_ids.includes(localChatItem.friend_id)) {
                const indexOfTargetChatItem = idMap[localChatItem.friend_id];
                const { new_msg_count } = list[indexOfTargetChatItem];
                const newItem = {
                    ...localChatItem,
                    new_msg_count: is_chating ? 0 : new_msg_count + 1
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
        default: return state
    }
}
export default chatList;
