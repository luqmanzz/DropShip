/**
 * React Static Boilerplate
 * Copyright (c) 2015-present Kriasoft. All rights reserved.
 */

/* @flow */
import { persistCombineReducers, persistStore } from 'redux-persist';
import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import RehydrationConfig from '../Services/RehydrationServices';
import reducers from './Reducers';

const middleware = [];
const reducers2 = persistCombineReducers(RehydrationConfig, reducers);
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
middleware.push(
    thunk.withExtraArgument({
        // apiClient: ApiClient,
    }),
);
// if (process.env.NODE_ENV === 'development') {
//     const { createLogger } = require(`redux-logger`);
//     const logger = createLogger({
//     // ...options
//         collapsed: true,
//     });
//     middleware.push(logger);
// }
// enhancers.push(applyMiddleware(...middleware));
// enhancers.push(autoRehydrate());
export const store = createStore(reducers2, composeEnhancers(applyMiddleware(...middleware)));
export const persistor = persistStore(store);
// window.__store = store;
