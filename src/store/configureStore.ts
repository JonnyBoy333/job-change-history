import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { ActionTypes, AuthenticationActionTypes } from '../actions/ActionTypes';
import rootReducer from '../reducers/rootReducer';
import IStoreState from './IStoreState';

const middleware = [thunk];

export default function configureStore() {
  return createStore<IStoreState, ActionTypes | AuthenticationActionTypes, {}, {}>(
    rootReducer,
    composeWithDevTools(applyMiddleware(...middleware))
  )
}