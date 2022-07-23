import { ACCOUNT_LIST_SUCCESS, CONTRACT_ABI_SUCCESS } from "../constants/actionTypes";

const initialState = {
    accountList: [],
    contractABI: [],
    contractFunction: [],
};

const AccountReducer = (state = initialState, action) => {
    switch(action.type) {
        case ACCOUNT_LIST_SUCCESS:
            return {
                ...state,
                accountList: action.data
            }
        case CONTRACT_ABI_SUCCESS:
            let data = action.data;
            return {
                ...state,
                contractABI: data.abi,
                contractFunction: data.contractFunction,
            }
        default: return state;
    }
}

export default AccountReducer;