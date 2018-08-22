import { ActionTypeKeys as keys } from '../actions/ActionTypeKeys'
import { JobActionTypes } from '../actions/ActionTypes';
import IStoreState from '../store/IStoreState';
import initialState from './initialState';

function sessionReducer(state = initialState.job, action: JobActionTypes) {
  switch(action.type) {
    case keys.START_JOB : {
      return applyStartJob(state, action.payload);
    }
    case keys.UPDATE_2FA : {
      return applyUpdate2FA(state, action.payload);
    }
    case keys.UPDATE_PROGRESS : {
      return applyUpdateProgress(state, action.payload);
    }
    case keys.UPDATE_SCREENSHOT : {
      return applyUpdateScreenshot(state, action.payload);
    }
    default :
      return state;
  }
}

const applyStartJob = (state: IStoreState['job'], payload: IStoreState['job']['started']) => ({
  ...state,
  started: payload
});

const applyUpdate2FA = (state: IStoreState['job'], payload: IStoreState['job']['2FA']) => ({
  ...state,
  '2FA': payload
});

const applyUpdateProgress = (state: IStoreState['job'], payload: IStoreState['job']['progress']) => ({
  ...state,
  progress: payload
});

const applyUpdateScreenshot = (state: IStoreState['job'], payload: IStoreState['job']['screenshot']) => ({
  ...state,
  screenshot: payload
});

export default sessionReducer;