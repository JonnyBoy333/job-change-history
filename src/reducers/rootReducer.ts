import { combineReducers } from 'redux';
import { ActionTypeKeys as keys } from '../actions/ActionTypeKeys'
import { AuthenticationActionTypes } from '../actions/ActionTypes';
import IStoreState from '../store/IStoreState';
import ramen from './fetchRamenReducer';
import initialState from './initialState';
import pendingActions from './pendingActionsReducer';
import sessionState from './sessionReducer';

const appReducer = combineReducers<IStoreState>({
  pendingActions,
  ramen,
  sessionState
});

const rootReducer = (state: IStoreState, action: AuthenticationActionTypes) => {
  if (action.type ===  keys.LOG_OUT) {
    state = {
      ...initialState
    };
  }
      
  return appReducer(state, action)
}

export default rootReducer;