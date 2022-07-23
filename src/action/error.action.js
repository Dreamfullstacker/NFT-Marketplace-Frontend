import { ERROR_OCCURED, SUCCESS_OCCURED } from "../constants/actionTypes";

export const errorOccured = (message) => {
    return {
        type: ERROR_OCCURED,
        message
    }
}

export const successOccured = (message) => {
    return {
        type: SUCCESS_OCCURED,
        message
    }
}