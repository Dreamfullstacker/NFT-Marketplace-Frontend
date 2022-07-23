import { all } from 'redux-saga/effects';
import authSaga from './auth.saga';
import accountSaga from './account.saga';

export default function* rootSaga() {
    yield all([
        authSaga(),
        accountSaga(),
    ])
}