import * as firebase from 'firebase';

export interface IRamen {
  id: string;
  name: string;
  rating: number;
  url: string;
  location: {
    address1: string;
    city: string;
    zip_code: string;
    state: string;
  }
  distance: number;
}

export default interface IStoreState {
  readonly ramen: IRamen[] | Error;
  readonly pendingActions: {
    fetchRamen: boolean;
  }
  readonly sessionState: {
    authUser: firebase.User | null;
    signInError: null | Error;
    signUpError: null | Error;
  }
  readonly job: {
    started: boolean;
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