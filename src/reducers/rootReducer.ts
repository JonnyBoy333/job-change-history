import { combineReducers } from 'redux';
import { ActionTypeKeys as keys } from '../actions/ActionTypeKeys'
import { AuthenticationActionTypes } from '../actions/ActionTypes';
import IStoreState from '../store/IStoreState';
import initialState from './initialState';
import job from './jobReducer';
import sessionState from './sessionReducer';

const appReducer = combineReducers<IStoreState>({
  job,
  sessionState,
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