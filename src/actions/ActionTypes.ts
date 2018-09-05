import * as firebase from 'firebase';
import IStoreState from '../store/IStoreState';
import { ActionTypeKeys } from './ActionTypeKeys';

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

export interface IStartJobAction {
  readonly type: ActionTypeKeys.START_JOB;
  readonly payload: IStoreState['job']['started'];
}

export interface IUpdate2FAAction {
  readonly type: ActionTypeKeys.UPDATE_2FA;
  readonly payload: IStoreState['job']['2FA'];
}

export interface IUpdateProgressAction {
  readonly type: ActionTypeKeys.UPDATE_PROGRESS;
  readonly payload: IStoreState['job']['progress'];
}

export interface IUpdateScreenshotAction {
  readonly type: ActionTypeKeys.UPDATE_SCREENSHOT;
  readonly payload: IStoreState['job']['screenshot'];
}

export interface ISendAuthMessageAction {
  readonly type: ActionTypeKeys.SEND_AUTH_MESSAGE;
  readonly payload: IStoreState['job']['2FA']['authMethod'];
}

export interface ISubmitAuthCodeAction {
  readonly type: ActionTypeKeys.SUBMIT_AUTH_CODE;
  readonly payload: IStoreState['job']['2FA']['code'];
}

export interface ICancelJobAction {
  readonly type: ActionTypeKeys.CANCEL_JOB;
  readonly payload: IStoreState['job'];
}

export interface IPauseJobAction {
  readonly type: ActionTypeKeys.PAUSE_JOB;
  readonly payload: IStoreState['job']['paused'];
}

export interface IErrorJobAction {
  readonly type: ActionTypeKeys.ERROR_JOB;
  readonly payload: IStoreState['job']['errored'];
}

type JobActionTypes = IStartJobAction | IUpdate2FAAction | IUpdateProgressAction | IUpdateScreenshotAction | ISendAuthMessageAction | ISubmitAuthCodeAction | ICancelJobAction | IPauseJobAction | IErrorJobAction;

export {
  AuthenticationActionTypes,
  JobActionTypes
};