import { ACTION_GET_WEATHER } from '../constaints';


const initState = {
    city: '',
    cityid:'',
    data:[
       {
           air: 0,
           air_level:'',
           air_tips:'',
           alarm: {
               alarm_content:'',
               alarm_level:'',
               alarn_type:''
           },
           date:'',
           day:'',
           tem1:'',
           tem2:'',
           wea:'阴转多云',
           week:'星期X',
           win:["北风","北风"],
           win_speed:''
       } 
    ],
    update_time:''
}
const weather = (state={
    city: '',
    cityid:'',
    data:[
       {
           air: 0,
           air_level:'',
           air_tips:'',
           alarm: {
               alarm_content:'',
               alarm_level:'',
               alarn_type:''
           },
           date:'',
           day:'',
           tem1:'',
           tem2:'',
           wea:'阴转多云',
           week:'星期X',
           win:["北风","北风"],
           win_speed:''
       } 
    ],
    update_time:''
},action)=>{

    switch(action.type){
        case ACTION_GET_WEATHER:{
            console.log("获取天气中...");
            return state;
        }
        case `${ACTION_GET_WEATHER}_SUC`:{
            console.log("获取天气中成功");
            const {response} = action;
            console.log(response)
            return {
                ...state,
                ...response
            };
        }
        case `${ACTION_GET_WEATHER}_FAI`:{
            const {err} = action;
            console.log("获取天气中失败",err);
            return initState;
        }
        default: return state;
    }
}

export default weather;