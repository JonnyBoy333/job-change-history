import { ActionTypeKeys as keys } from '../actions/ActionTypeKeys'
import { ActionTypes, IFetchRamenFailAction, IFetchRamenSuccessAction } from '../actions/ActionTypes';
import initialState from './initialState';

export default function fetchRamenReducer(state = initialState.ramen, action: ActionTypes) {
  switch (action.type) {
    case keys.FETCH_RAMEN_SUCCESS:
      return fetchRamenSuccess(action);
    case keys.FETCH_RAMEN_FAIL:
      return fetchRamenFail(action);
    default:
      return state;
  }
}

function fetchRamenSuccess(action: IFetchRamenSuccessAction) {
  return action.payload;
}

function fetchRamenFail(action: IFetchRamenFailAction) {
  return action.payload;
}