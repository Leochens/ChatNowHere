import config from './config';

import io from 'socket.io-client';

const socket = io(`${config.host}:${config.port}`, {
  transports: ['websocket'],
  reconnection: true
});


socket.on('connect', function (data) {

  console.log("Connected to Server");
  global.reconnectFailCount = 0;
});
socket.on('connect_failed', function (data) {
  console.log("connect_failed to Server");
});
socket.on('error', function (data) {
  console.log("error");
  alert("连接服务器失败");
});
socket.on('reconnecting', function (data) {
  console.log("reconnecting");
  global.reconnectFailCount++;
  if (global.reconnectFailCount >= 6) {

    alert("连接服务器失败，请检查您当前的网络,也可能是服务器出错了");
  }
});
socket.on('reconnect', function (data) {
  console.log("reconnect");
  global.reconnectFailCount--;
});
socket.on('disconnect', function (data) {
  console.log("disconnect");
});



export default socket;
