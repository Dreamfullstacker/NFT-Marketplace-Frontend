import auth from './auth.reducer';
import account from './account.reducer';
import snackbar from './snackbar.reducer';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    auth,
    account,
    snackbar
});

export default rootReducer;