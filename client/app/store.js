import { createStore,applyMiddleware} from 'redux';
import {createLogger} from 'redux-logger';
import serverApi from './middlewares/serverApi';
import dbApi from './middlewares/dbApi';
import weatherApi from './middlewares/weatherApi';
import rootReducer from './reducers';

const logger = createLogger();
const store = createStore(rootReducer,applyMiddleware(dbApi,weatherApi,serverApi,logger));

export default store;