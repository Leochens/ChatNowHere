import ReactSQLite from '../nativeModules/ReactSQLite';
import * as ACTIONS from '../constaints';
const actionsFilter = {};
actionsFilter[ACTIONS.ACTION_GET_CHATLIST] = params => {
    return new Promise((resolve, reject) => {
        ReactSQLite.getChatList(list => {
            if (list) {
                return resolve({list});
            }
            return reject("查询聊天列表失败")
        });
    });
}

actionsFilter[ACTIONS.ACTION_GET_RECORD] = params => {
    const { friend_id } = params;
    return new Promise((resolve, reject) => {
        ReactSQLite.getChatRecords(friend_id,list => {
            if (list) {
                return resolve({list});
            }
            return reject("查询聊天记录失败")
        });
    });
}

actionsFilter[ACTIONS.ACTION_GET_MORE_RECORD] = params => {
    const { friend_id,initId } = params;
    return new Promise((resolve, reject) => {
        ReactSQLite.getMoreRecords(friend_id,initId,list => {
            if (list) {
                return resolve({list});
            }
            return reject("查询更多聊天记录失败")
        });
    });
}

actionsFilter[ACTIONS.ACTION_GET_SIDER_BG_IMG] = params => {
    // const { friend_id,initId } = params;
    return new Promise((resolve, reject) => {
        ReactSQLite.getSiderBgImage(bgImg => {
            if (bgImg) {
                return resolve({bgImg});
            }
            return reject("查询更多聊天记录失败")
        });
    });
}
export default store => next => action => {
    if (!action.DB_API) {
        return next(action);
    }
    const {
        DB_API: {
            type,
            params
        }
    } = action;

    actionsFilter[type](params).then(res => {
        return next({
            type:`${type}_SUC`,
            res
        })
    }).catch(err => { console.log("DBAPI", err) });

}