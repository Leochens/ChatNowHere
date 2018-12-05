import { ACTION_IN_CHATING,ACTION_OUT_CHATING } from '../constaints';


const ui = (state={
    is_chating: false
},action)=>{

    switch(action.type){
        case ACTION_IN_CHATING: {
            return {
                ...state,
                is_chating: true
            }
        }
        case ACTION_OUT_CHATING: {
            return {
                ...state,
                is_chating: false
            }
        }
        default: return state
    }
}
export default ui;