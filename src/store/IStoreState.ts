import * as firebase from 'firebase';

export default interface IStoreState {
  readonly sessionState: {
    authUser: firebase.User | null;
    signInError: null | Error;
    signUpError: null | Error;
  }
  readonly job: {
    started: boolean;
    canceled: boolean;
    paused: boolean;
    errored: boolean;
    '2FA': {
      has2FA: boolean;
      authMethod: string;
      code: string;
      defeated: boolean;
    }
    progress: {
      percent: number,
      processed: number,
      total: number
    }
    screenshot: string;
  }
}