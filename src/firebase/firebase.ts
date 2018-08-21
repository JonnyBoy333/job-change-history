import * as firebase from 'firebase';
import 'firebase/auth';
import 'firebase/database';

const config = {
  apiKey: "AIzaSyDcHFZsPCCNNUGMmv_guJmiQA6sSrIgYbU",
  authDomain: "kpay-automator.firebaseapp.com",
  databaseURL: "https://kpay-automator.firebaseio.com",
  messagingSenderId: "949570070359",
  projectId: "kpay-automator",
  storageBucket: "kpay-automator.appspot.com",
};

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

const db = firebase.database();
const auth = firebase.auth();
// const functions = firebase.functions();

export {
  db,
  auth
}