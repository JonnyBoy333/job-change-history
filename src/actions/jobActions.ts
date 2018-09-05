import { Dispatch } from 'redux';
import { db } from '../firebase';
import initialState from '../reducers/initialState';
import IStoreState from '../store/IStoreState';
import { ActionTypeKeys as keys } from './ActionTypeKeys';
import { ICancelJobAction, IErrorJobAction, IPauseJobAction, ISendAuthMessageAction, IStartJobAction, ISubmitAuthCodeAction, IUpdate2FAAction, IUpdateProgressAction, IUpdateScreenshotAction, JobActionTypes } from './ActionTypes';

export type ISendAuthMessage = (id: string, authMethod: IStoreState['job']['2FA']['authMethod']) => (dispatch: Dispatch<JobActionTypes>) => Promise<void>;

// export function signInAsync(email: string, password: string): (dispatch: Dispatch<AuthenticationActionTypes>) => Promise<void> {
//   return async (dispatch: Dispatch<IAuthSuccessAction | ISignInErrorAction>) => {
//     try {
//       const user = await auth.doSignInWithEmailAndPassword(email, password);
//       if (user.user && user.user.emailVerified) {
//         dispatch(authSetUser(user.user));
//       } else {
//         auth.doSignOut();
//         throw new Error('Account not verified. Please check your email for a verification email.');
//       }
//     } catch (err) {
//       dispatch(signInError(err));
//       console.log('Error Signing In', err);
//     }
//   }
// }


export function sendAuthMessage(id: string, authMethod: IStoreState['job']['2FA']['authMethod']): (dispatch: Dispatch<JobActionTypes>) => Promise<void> {
  return async (dispatch: Dispatch<ISendAuthMessageAction>) => {
    try {
      console.log('authmethod', authMethod);
      console.log('UID', id);
      fetch(`/api/authMethod?authmethod=${authMethod}&uid=${id}`)
      .then(res => res.json())
      .then((res) => {
        console.log('Response', res)
        const result = res.result;
        if (result !== 'success') {
          // this.setState({ error: res.error.message }); // TODO: error handling
        }
      })
      .catch(err => console.log(err));

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
      fetch(`/api/authMethod?authcode=${code}&uid=${id}`)
      .then(res => res.json())
      .then((res) => {
        console.log('Response', res)
        const result = res.result;
        if (result !== 'success') {
          // this.setState({ error: res.error.message }); // TODO: error handling
        }
      })
      .catch(err => console.log(err));

      await db.submitAuthCode(id, code);
      dispatch(submitAuthCodeAction(code));
    } catch (err) {
      console.error(err);
    }
  }
}

export type ICancelJob = (uid: string) => (dispatch: Dispatch<JobActionTypes>) => Promise<void>;
export function cancelJob(uid: string): (dispatch: Dispatch<JobActionTypes>) => Promise<void> {
  return async (dispatch: Dispatch<ICancelJobAction>) => {
    try {

      const canceledJobState = {
        ...initialState.job,
        canceled: true
      }
      await db.cancelJob(uid, canceledJobState);
      dispatch(cancelJobAction(canceledJobState));
    } catch (err) {
      console.error(err);
    }
  }
}

export type IStartJob = (started: IStoreState['job']['started']) => IStartJobAction;
export function startJob(started: IStoreState['job']['started']): IStartJobAction {
  return startJobAction(started);
}

export type IPauseJob = (paused: IStoreState['job']['paused']) => IPauseJobAction;
export function pauseJob(started: IStoreState['job']['paused']): IPauseJobAction {
  return pauseJobAction(started);
}

export type IErrorJob = (started: IStoreState['job']['errored']) => IErrorJobAction;
export function errorJob(started: IStoreState['job']['errored']): IErrorJobAction {
  return errorJobAction(started);
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

function pauseJobAction(paused: IStoreState['job']['paused']): IPauseJobAction {
  return {
    payload: paused,
    type: keys.PAUSE_JOB
  }
}

function errorJobAction(errored: IStoreState['job']['errored']): IErrorJobAction {
  return {
    payload: errored,
    type: keys.ERROR_JOB
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

function cancelJobAction(canceledJobState: IStoreState['job']): ICancelJobAction {
  return {
    payload: canceledJobState,
    type: keys.CANCEL_JOB,
  }
}