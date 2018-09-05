import * as firebase from 'firebase';
import IStoreState from '../store/IStoreState';
import { db } from './firebase';

// User API

export const doCreateUser = (id: string, email: string) =>
  db.ref(`users/${id}`).set({
    email,
  });

export const onceGetUsers = () =>
  db.ref('users').once('value');

export const saveZip = (id: string, zip: string) =>
  db.ref(`users/${id}`).set({
    zip
  })

export const getZip = (id: string) =>
  db.ref(`users/${id}`).once('value');

interface IStoreStateWithMessage extends IStoreState {
  job: {
    started: boolean;
    '2FA': {
      has2FA: boolean;
      authMethod: string;
      code: string;
      defeated: boolean;
      messageSent: boolean;
    }
    progress: {
      percent: number,
      processed: number,
      total: number
    }
    screenshot: string;
    canceled: boolean;
    paused: boolean;
    errored: boolean;
  }
}
export const getJob = (id: string, callback: (job: IStoreStateWithMessage['job'] | null) => void) =>
  db.ref(`users/${id}`).on('value', (snapshot: firebase.database.DataSnapshot) => {
    const val = snapshot.val();
    // console.log('Snapshot', val);
    if (val && val.job) {
      callback(val.job)
    } else {
      callback(null);
    }
  });

export const sendAuthMessage = (id: string, authMethod: string) =>
  db.ref(`users/${id}/job/2FA`).update({ authMethod })

export const submitAuthCode = (id: string, code: string) =>
  db.ref(`users/${id}/job/2FA`).update({ code })

export const updateMessageSent = (id: string, messageSent: boolean) =>
  db.ref(`users/${id}/job/2FA`).update({ messageSent })

export const cancelJob = (uid: string, canceledJobState: IStoreState['job']) => 
  db.ref(`users/${uid}/job`).update({ ...canceledJobState })
