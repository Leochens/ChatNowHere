import axios from 'axios';
import config from '../config';
const API_DOMAIN = `${config.host}:${config.port}/dbtest`;
// 登录action拥有特殊字段 LOGIN
// 需要登录后在dispatch的action有AFTER_LOGIN 字段
// 普通action什么特殊字段都没有 next就好
// 如果此时发来的是LOGIN action 那么就执行
// 如果不是 那么就放入等待队列
// 等待LOGIN结束并成功后再发起 拉取其他需登录后拉取的数据

const waitActionQueue = [];
const callServerApi = (endpoint, params, normalizeFunc) => new Promise((resolve, reject) => {
  axios({
    method: 'POST',
    url: API_DOMAIN + endpoint,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: params
  }).then(res => {
    if (res.data.code === 200) {
        console.log("请求原始数据",res.data);
      return resolve(normalizeFunc ? normalizeFunc(res.data) : res.data);
    }

    return reject(new Error(res.data.msg));
  }).catch(err => reject(err));
});

/* eslint-disable no-unused-vars */
export default store => next => action => {
  if (!action.SERVER_API) {
    return next(action);
  }
  const {
    type,
    endpoint,
    params,
    normalizeFunc,
    extra,
    AFTER_LOGIN,
    IS_LOGIN
  } = action.SERVER_API;
  const { token } = store.getState().userinfo;

  if (AFTER_LOGIN) {
    if (!token) {
      waitActionQueue.push(action);
      return null;
    }
    params.token = token;
  }

  if (typeof type !== 'string') {
    throw new Error('type shoudle be a string');
  }
  if (typeof endpoint !== 'string') {
    throw new Error('endpoint shoudle be a string');
  }
  if (typeof params !== 'object') {
    throw new Error('params shoudle be a object');
  }

  next({
    type: `${type}_REQ`
  });

  return callServerApi(endpoint, params, normalizeFunc)
    .then(response => {
      next({
        type: `${type}_SUC`,
        response,
        extra
      });
      if (IS_LOGIN) {
        // console.log(waitActionQueue);
        waitActionQueue.forEach(action => {
          action.SERVER_API.params.token = response.token;
          store.dispatch(action);
        });
        waitActionQueue.length = 0;
      }
    }).catch(err => {
      next({
        type: `${type}_FAI`,
        errMsg: err.errMsg
      });
    });
};