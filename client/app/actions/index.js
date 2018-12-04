import * as ACTIONS from '../constaints';
import axios from 'axios';


export const actionLogin = (data) => {
    const { username,password }= data;

    //TODO 和服务端交互进行登录
    

}

export const actionLoginSuc = (data) => {

    return {
        type: `${ACTIONS.ACTION_USER_LOGIN}_SUC`,
        data
    }
}
export const actionLoginFai = (data) => {

    return {
        type: `${ACTIONS.ACTION_USER_LOGIN}_FAI`,
        data
    }
}


export const actionInChating = () => {
    return {
        type: ACTIONS.ACTION_IN_CHATING
    }
}



export const actionOutChating = () => {
    return {
        type: ACTIONS.ACTION_OUT_CHATING
    }
}