import IStoreState from '../store/IStoreState';

const defaultState: IStoreState = {
  pendingActions: {
    fetchRamen: false
  },
  ramen: [],
  sessionState: {
    authUser: null,
    signInError: null,
    signUpError: null,
  }
}

export default defaultState;