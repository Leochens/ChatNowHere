import { createStore,applyMiddleware} from 'redux';
import {createLogger} from 'redux-logger';
import serverApi from './middlewares/serverApi';
import rootReducer from './reducers';
const logger = createLogger();
const store = createStore(rootReducer,applyMiddleware(serverApi,logger));

export default store;