import IStoreState from '../store/IStoreState';

const defaultState: IStoreState = {
  job: {
    '2FA': {
      authMethod: '',
      code: '',
      defeated: false,
      has2FA: false,
    },
    progress: {
      percent: 0,
      processed: 0,
      total: 0
    },
    screenshot: '',
    started: false,
    canceled: false,
    paused: false,
    errored: false
  },
  sessionState: {
    authUser: null,
    signInError: null,
    signUpError: null,
  },
}

export default defaultState;