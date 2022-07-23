import { EMPTY_SNACKBAR, ERROR_OCCURED, SUCCESS_OCCURED } from "../constants/actionTypes";
import { ERROR, SUCCESS } from "../constants/messageTypes";

const initialState = {
    message: null,
    type: null,
};

const SnackbarReducer = (state = initialState, action) => {
    switch(action.type) {
        case ERROR_OCCURED:
            return {
                ...state,
                message: action.message,
                type: ERROR
            }
        case EMPTY_SNACKBAR:
            return {
                ...state,
                message: null,
                type: null,
            }
        case SUCCESS_OCCURED:
            return {
                ...state,
                message: action.message,
                type: SUCCESS,
            }
        default:
            return state;
    }
}

export default SnackbarReducer;