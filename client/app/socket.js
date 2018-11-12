import config from './config';

import io from 'socket.io-client';

const socket = io(`${config.host}:${config.port}`,{
    transports: ['websocket'],
  });
export default socket;
