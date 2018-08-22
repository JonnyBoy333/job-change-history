import { Dispatch } from 'redux';
import { db } from '../firebase';
import IStoreState from '../store/IStoreState';
import { ActionTypeKeys as keys } from './ActionTypeKeys';
import { ISendAuthMessageAction, IStartJobAction, ISubmitAuthCodeAction, IUpdate2FAAction, IUpdateProgressAction, IUpdateScreenshotAction, JobActionTypes } from './ActionTypes';

export type ISendAuthMessage = (id: string, authMethod: IStoreState['job']['2FA']['authMethod']) => (dispatch: Dispatch<JobActionTypes>) => Promise<void>;
export function sendAuthMessage(id: string, authMethod: IStoreState['job']['2FA']['authMethod']): (dispatch: Dispatch<JobActionTypes>) => Promise<void> {
  return async (dispatch: Dispatch<ISendAuthMessageAction>) => {
    try {
      await db.sendAuthMessage(id, authMethod);
      dispatch(sendAuthMessageAction(authMethod));
    } catch (err) {
      console.error(err);
    }
  }
}

export type ISubmitAuthCode = (id: string, code: IStoreState['job']['2FA']['code']) => (dispatch: Dispatch<JobActionTypes>) => Promise<void>;
export function submitAuthCode(id: string, code: IStoreState['job']['2FA']['code']): (dispatch: Dispatch<JobActionTypes>) => Promise<void> {
  return async (dispatch: Dispatch<ISubmitAuthCodeAction>) => {
    try {
      await db.submitAuthCode(id, code);
      dispatch(submitAuthCodeAction(code));
    } catch (err) {
      console.error(err);
    }
  }
}

export type IStartJob = (started: IStoreState['job']['started']) => IStartJobAction;
export function startJob(started: IStoreState['job']['started']): IStartJobAction {
  return startJobAction(started);
}

export type IUpdate2FA = (twoFA: IStoreState['job']['2FA']) => IUpdate2FAAction;
export function update2FA(twoFA: IStoreState['job']['2FA']): IUpdate2FAAction {
  return update2FAAction(twoFA);
}

export type IUpdateProgress = (progress: IStoreState['job']['progress']) => IUpdateProgressAction;
export function updateProgress(progress: IStoreState['job']['progress']): IUpdateProgressAction {
  return updateProcessAction(progress);
}

export type IUpdateScreenshot = (screenshot: IStoreState['job']['screenshot']) => IUpdateScreenshotAction;
export function updateScreenshot(screenshot: IStoreState['job']['screenshot']): IUpdateScreenshotAction {
  return updateImageAction(screenshot);
}

function sendAuthMessageAction(authMethod: IStoreState['job']['2FA']['authMethod']): ISendAuthMessageAction {
  return {
    payload: authMethod,
    type: keys.SEND_AUTH_MESSAGE
  }
}

function submitAuthCodeAction(messageType: IStoreState['job']['2FA']['code']): ISubmitAuthCodeAction {
  return {
    payload: messageType,
    type: keys.SUBMIT_AUTH_CODE
  }
}

function startJobAction(started: IStoreState['job']['started']): IStartJobAction {
  return {
    payload: started,
    type: keys.START_JOB
  }
}

function update2FAAction(twoFA: IStoreState['job']['2FA']): IUpdate2FAAction {
  return {
    payload: twoFA,
    type: keys.UPDATE_2FA,
  }
}

function updateProcessAction(progress: IStoreState['job']['progress']): IUpdateProgressAction {
  return {
    payload: progress,
    type: keys.UPDATE_PROGRESS,
  }
}

function updateImageAction(screenshot: IStoreState['job']['screenshot']): IUpdateScreenshotAction {
  return {
    payload: screenshot,
    type: keys.UPDATE_SCREENSHOT,
  }
}