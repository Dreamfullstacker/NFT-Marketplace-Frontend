import {AUTH_CHECK, EMPTY_CURRENT_USER, SET_CURRENT_USER} from "../constants/actionTypes";
import {axiosConfig} from "../config/axios.config";

const initialState = {
    user: null,
    isAuthenticated: false,
}

let token;

const AuthReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_CURRENT_USER:
            return {
                ...state,
                isAuthenticated: true,
                user: action.data,
            }
        case EMPTY_CURRENT_USER:
            return {
                ...state,
                isAuthenticated: false,
                user: null,
            }
        case AUTH_CHECK:
            token = localStorage.getItem('authToken');
            if(token) {
                axiosConfig(token);
                return {
                    ...state,
                    isAuthenticated: true
                }
            }
            return state;
        default: return state;
    }
}

export default AuthReducer;