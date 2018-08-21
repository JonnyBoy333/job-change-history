import { ActionTypeKeys } from '../actions/ActionTypeKeys';
import { ActionTypes } from '../actions/ActionTypes';
import initialState from './initialState';

export default function pendingActionReducer (state = initialState.pendingActions, action: ActionTypes) {
  if (action.type === ActionTypeKeys.FETCH_RAMEN_INPROGRESS) {
    return {
      fetchRamen: true
    }
  } else if (action.type === ActionTypeKeys.FETCH_RAMEN_FAIL || action.type === ActionTypeKeys.FETCH_RAMEN_SUCCESS) {
    return {
      fetchRamen: false
    }
  } else {
    return state;
  }
}