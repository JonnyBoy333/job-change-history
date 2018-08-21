import * as firebase from 'firebase';
import { IRamen } from '../store/IStoreState';
import { ActionTypeKeys } from './ActionTypeKeys';

export interface IFetchRamenSuccessAction {
  readonly type: ActionTypeKeys.FETCH_RAMEN_SUCCESS;
  readonly payload: IRamen[];
}
export interface IFetchRamenInProgressAction {
  readonly type: ActionTypeKeys.FETCH_RAMEN_INPROGRESS
}
export interface IFetchRamenFailAction {
  readonly type: ActionTypeKeys.FETCH_RAMEN_FAIL;
  readonly payload: Error;
}
type ActionTypes = IFetchRamenSuccessAction | IFetchRamenInProgressAction | IFetchRamenFailAction;

export interface IAuthSuccessAction {
  readonly type: ActionTypeKeys.AUTH_USER_SET;
  readonly authUser: firebase.User;
}
export interface ILogoutAction {
  readonly type: ActionTypeKeys.LOG_OUT;
}
export interface ISignInAction {
  readonly type: ActionTypeKeys.SIGN_IN;
}
export interface ISignUpAction {
  readonly type: ActionTypeKeys.SIGN_UP;
  readonly payload: firebase.User;
}
export interface ISignUpErrorAction {
  readonly type: ActionTypeKeys.SIGN_UP_ERROR;
  readonly payload: Error;
}
export interface ISignInErrorAction {
  readonly type: ActionTypeKeys.SIGN_IN_ERROR;
  readonly payload: Error;
}
type AuthenticationActionTypes = ISignUpAction | ILogoutAction | ISignInAction | IAuthSuccessAction | ISignUpErrorAction | ISignInErrorAction;

export { 
  ActionTypes,
  AuthenticationActionTypes
};