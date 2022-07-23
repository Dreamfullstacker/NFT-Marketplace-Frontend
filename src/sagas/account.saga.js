import {Request} from "./basic";
import { put, takeLatest } from 'redux-saga/effects';
import {
    ACCOUNT_LIST_REQUEST, 
    ACCOUNT_LIST_SUCCESS,
    ACCOUNT_SAVE_REQUEST,
    MINT_SAVE_DATA_REQUEST,
    CONTRACT_ABI_REQUEST,
    CONTRACT_ABI_SUCCESS,
    ERROR_OCCURED,
    SUCCESS_OCCURED,
    SET_CURRENT_USER
} from "../constants/actionTypes";
import {errorOccured} from "../action/error.action";

function* AccountSave (action) {
    try {
        const responseData = yield Request('nfttrading/saveAccount', 'POST', action.data);
        if(responseData.success) {
            yield put({type: SUCCESS_OCCURED, message: 'Make account successfully!'});
            yield put({type: SET_CURRENT_USER, data: responseData.success});
            yield put({type: ACCOUNT_LIST_SUCCESS, data: responseData.success.accounts});
        }
        else yield put(errorOccured(responseData));
    }
    catch(err) {
        yield put({type: ERROR_OCCURED, message: 'The number of wallet is already 5.'});
    }
}


function* GetAccounts (action) {
    try {
        const responseData = yield Request('nfttrading/getAccounts', 'POST', {});
        if(responseData) {
            yield put({type: ACCOUNT_LIST_SUCCESS, data: responseData.data});
        }
    }
    catch(err) {
        console.log(err);
    }
}

function* contractABIFromAddress (action) {
    try {
        const responseData = yield Request('nfttrading/getAbiFromAddress', 'POST', action.data);
        if(responseData.success) {
            let num = 0;
            let abi = JSON.parse(responseData.success);
            let contractFunction = [];
            for(let i=0; i<abi.length; i++) {
                if(abi[i].type === "function" && abi[i].name.toLowerCase().includes('mint')) {
                    contractFunction.push(abi[i]);
                    num++;
                }
            }
            yield put({type: CONTRACT_ABI_SUCCESS, data: {abi, contractFunction}});

            if(num === 0) yield put({type: ERROR_OCCURED, message: 'Invalid Contract Address!'});
            else yield put({type: SUCCESS_OCCURED, message: 'Find mint function successfully!'});
        }
        else yield put({type: ERROR_OCCURED, message: responseData.message});
    }
    catch(err) {
        yield put({type: ERROR_OCCURED, message: err.toString()});
    }
}

function* mintDataSave (action) {
    try {
        const responseData = yield Request('nfttrading/mintDataSave', 'POST', action.data);
        if(responseData.success) {
            yield put({type: SUCCESS_OCCURED, message: 'NFT will be mint successfully!'});
        }
        else {
            yield put({type: ERROR_OCCURED, message: responseData.message});
        }
    }
    catch(err) {
        yield put({type: ERROR_OCCURED, message: err.toString()});
    }
}

export default function* accountSaga() {
    yield takeLatest(ACCOUNT_SAVE_REQUEST, AccountSave);
    yield takeLatest(ACCOUNT_LIST_REQUEST, GetAccounts);
    yield takeLatest(CONTRACT_ABI_REQUEST, contractABIFromAddress);
    yield takeLatest(MINT_SAVE_DATA_REQUEST, mintDataSave);
}