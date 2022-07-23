import createSagaMiddleware from "@redux-saga/core";
import { createStore, applyMiddleware } from 'redux';
import rootReducer from "./reducers";
import { logger } from 'redux-logger';
import rootSaga from './sagas';
import { composeWithDevTools  } from "redux-devtools-extension";

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
    rootReducer,
    composeWithDevTools(
        applyMiddleware(sagaMiddleware, logger)
    )
)

sagaMiddleware.run(rootSaga);

export default store;