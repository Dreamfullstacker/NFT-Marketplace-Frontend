import {Request} from "./basic";
import jwt_decode from 'jwt-decode';
import { put, takeLatest } from 'redux-saga/effects';
import {LOGIN_REQUEST, REGISTER_REQUEST, SET_CURRENT_USER, EMPTY_CURRENT_USER, SUCCESS_OCCURED, ERROR_OCCURED } from "../constants/actionTypes";
import {axiosConfig} from "../config/axios.config";
import {errorOccured} from "../action/error.action";

function* Register(action) {
  try {
    const responseData = yield Request('auth/register', 'POST', action.data);
    if (responseData.success) {
      yield put({ type: SUCCESS_OCCURED, message: 'Register Successfully!' });
      return action.navigate("/login", { replace: true });
    }
    else {
      yield put(errorOccured(responseData.message));
    }
    return responseData;
  }
  catch(err) {
    yield put({ type: ERROR_OCCURED, message: err });
  }
}

function* Login(action) {
  try {
    const responseData =  yield Request('auth/login', 'POST', action.data);
    if (responseData.success) {
      localStorage.setItem("authToken", responseData.success.token);
      axiosConfig(responseData.success.token);
      yield put({ type: SET_CURRENT_USER, data: jwt_decode(responseData.success.token) });
      yield put({ type: SUCCESS_OCCURED, message: 'Login Successfully!' });
      action.navigate("/", { replace: true })
    }
    else {
      yield put(errorOccured(responseData.message));
    }
  }
  catch(err) {
    yield put({ type: ERROR_OCCURED, message: err });
  }
}

export const Logout = () => {
  localStorage.removeItem("authToken");
}

export default function* authSaga() {
  yield takeLatest(LOGIN_REQUEST, Login);
  yield takeLatest(REGISTER_REQUEST, Register);
  yield takeLatest(EMPTY_CURRENT_USER, Logout);
}