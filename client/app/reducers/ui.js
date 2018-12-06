import { ACTION_IN_CHATING, ACTION_OUT_CHATING } from '../constaints';
import ReactSQLite from '../nativeModules/ReactSQLite';


const ui = (state = {
    isChating: false
}, action) => {

    switch (action.type) {
        case ACTION_IN_CHATING: {
            return {
                ...state,
                isChating: true
            }
        }
        case ACTION_OUT_CHATING: {
            return {
                ...state,
                isChating: false
            }
        }
        default: return state
    }
}
export default ui;