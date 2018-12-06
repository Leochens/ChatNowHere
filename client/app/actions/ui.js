import * as ACTIONS from '../constaints';

export const actionInChating = (data) => {
    return {
        type: ACTIONS.ACTION_IN_CHATING,
        data
    }
}



export const actionOutChating = () => {
    return {
        type: ACTIONS.ACTION_OUT_CHATING
    }
}


export const actionClearNewMsgCount = (friend_id) => {
    return {
        type: ACTIONS.ACTION_CLEAR_NEW_MSG_COUNT,
        friend_id
    }
}


export const actionUpdataRecord = (friend_id) => {
    return {
        type: ACTIONS.ACTION_UPDATE_RECORD,
        friend_id
    }
}



export default ui = {
    actionInChating,
    actionOutChating,
    actionClearNewMsgCount,
    
}