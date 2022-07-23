import { EMPTY_CURRENT_USER, LOGIN_REQUEST, REGISTER_REQUEST, SET_CURRENT_USER } from "../constants/actionTypes";

export const registerAction = (data, navigate) => ({
    type: REGISTER_REQUEST,
    data,
    navigate
})

export const loginAction = (data, navigate) => ({
    type: LOGIN_REQUEST,
    data,
    navigate
})

export const setCurrentUser = (data, navigate) => ({
    type: SET_CURRENT_USER,
    data,
    navigate
})

export const logoutAction = () => ({
    type: EMPTY_CURRENT_USER
})