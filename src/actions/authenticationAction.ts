import * as firebase from 'firebase';
import { Dispatch } from 'redux';
import { auth } from '../firebase';
import { db } from '../firebase';
import IStoreState from '../store/IStoreState';
import { ActionTypeKeys as keys } from './ActionTypeKeys';
import { AuthenticationActionTypes, IAuthSuccessAction, ILogoutAction, ISignInErrorAction, ISignUpAction, ISignUpErrorAction } from './ActionTypes';

export function authSetUserAsync(authUser: firebase.User): (dispatch: Dispatch<AuthenticationActionTypes>, getState: () => IStoreState) => Promise<void> {
  return async (dispatch: Dispatch<IAuthSuccessAction>, getState: () => IStoreState) => {
    dispatch(authSetUser(authUser))
  }
}

export function logOutAsync(): (dispatch: Dispatch<AuthenticationActionTypes>) => Promise<void> {
  return async (dispatch: Dispatch<ILogoutAction>) => {
    try {
      await auth.doSignOut();
      dispatch(logOut());
    } catch (err) {
      console.log('Error logging out', err);
    }
  }
}

export function signInAsync(email: string, password: string): (dispatch: Dispatch<AuthenticationActionTypes>) => Promise<void> {
  return async (dispatch: Dispatch<IAuthSuccessAction | ISignInErrorAction>) => {
    try {
      const user = await auth.doSignInWithEmailAndPassword(email, password);
      if (user.user && user.user.emailVerified) {
        dispatch(authSetUser(user.user));
      } else {
        auth.doSignOut();
        throw new Error('Account not verified. Please check your email for a verification email.');
      }
    } catch (err) {
      dispatch(signInError(err));
      console.log('Error Signing In', err);
    }
  }
}

export function signUpAsync(email: string, password: string): (dispatch: Dispatch<AuthenticationActionTypes>) => Promise<void> {
  return async (dispatch: Dispatch<ISignUpAction | ISignUpErrorAction>) => {
    try {
      const authUser = await auth.doCreateUserWithEmailAndPassword(email, password);
      console.log('Auth User', authUser);
      const user = authUser.user;
      if (user) {
        user.sendEmailVerification();
        await db.doCreateUser(user.uid, email);
        dispatch(signUp(user));
        await auth.doSignOut();
      }
    } catch (err) {
      dispatch(signUpError(err));
      console.log('Error Signing Up', err);
    }
  }
}

function authSetUser(authUser: firebase.User): IAuthSuccessAction {
  return {
    authUser,
    type: keys.AUTH_USER_SET,
  }
}

// function signIn(): ISignInAction {
//   return {
//     type: keys.SIGN_IN
//   }
// }

function signUp(authuser: firebase.User): ISignUpAction {
  return {
    payload: authuser,
    type: keys.SIGN_UP
  }
}

export function logOut(): ILogoutAction {
  return {
    type: keys.LOG_OUT
  }
}

function signUpError(err: Error): ISignUpErrorAction {
  return {
    payload: err,
    type: keys.SIGN_UP_ERROR
  }
}

function signInError(err: Error): ISignInErrorAction {
  return {
    payload: err,
    type: keys.SIGN_IN_ERROR
  }
}