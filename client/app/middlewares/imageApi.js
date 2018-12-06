
import axios from 'axios';
const doMain = 'https://sm.ms/api/upload';


const callAPi = (params) => {
    return new Promise((resolve, reject) => {
        axios(
            `${doMain}?version=${params.version}&city=${params.city}`,
            {
                method: 'GET',
            }).then(res => {
                if (res.status === 200)
                    return resolve(res.data);
                return reject(res);

            }).catch(err => {
                return reject(err);
            })
    });
}
export default store => next => action => {
    if (!action.IMAGE_API) {
        return next(action);
    }
    const { params, type } = action.WEATHER_API;

    callAPi(params).then(res => {
        return next({ type: `${type}_SUC`, response: res })
    }
    ).catch(err => {
        return next({ type: `${type}_FAI`, err });
    })
}