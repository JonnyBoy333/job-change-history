import { ActionTypeKeys as keys } from '../actions/ActionTypeKeys'
import { AuthenticationActionTypes, IAuthSuccessAction, ISignInErrorAction, ISignUpErrorAction } from '../actions/ActionTypes';
import IStoreState from '../store/IStoreState';
import initialState from './initialState';

const applySetAuthUser = (state: IStoreState['sessionState'], action: IAuthSuccessAction) => ({
  ...state,
  authUser: action.authUser
});

const setSignUpError = (state: IStoreState['sessionState'], action: ISignUpErrorAction) => ({
  ...state,
  signUpError: action.payload
})

const setSignIpError = (state: IStoreState['sessionState'], action: ISignInErrorAction) => ({
  ...state,
  signInError: action.payload
})

function sessionReducer(state = initialState.sessionState, action: AuthenticationActionTypes) {
  switch(action.type) {
    case keys.AUTH_USER_SET : {
      return applySetAuthUser(state, action);
    }
    case keys.SIGN_UP_ERROR : {
      return setSignUpError(state, action);
    }
    case keys.SIGN_IN_ERROR : {
      return setSignIpError(state, action);
    }
    default :
      return state;
  }
}

export default sessionReducer;