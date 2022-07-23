import {ACCOUNT_LIST_REQUEST, ACCOUNT_SAVE_REQUEST, CONTRACT_ABI_REQUEST, MINT_SAVE_DATA_REQUEST} from "../constants/actionTypes";

export const accountSave = (data) => ({
  type: ACCOUNT_SAVE_REQUEST,
  data
})

export const accountList = () => ({
  type: ACCOUNT_LIST_REQUEST
})

export const mintDataSave = (data) => ({
  type: MINT_SAVE_DATA_REQUEST,
  data
})

export const contractABIFromAddress = (data) => ({
  type: CONTRACT_ABI_REQUEST,
  data
})