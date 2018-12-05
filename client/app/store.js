import { createStore,applyMiddleware} from 'redux';
import {createLogger} from 'redux-logger';
import serverApi from './middlewares/serverApi';
import dbApi from './middlewares/dbApi';
import rootReducer from './reducers';

const logger = createLogger();
const store = createStore(rootReducer,applyMiddleware(dbApi,serverApi,logger));

export default store;