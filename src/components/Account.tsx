import * as firebase from 'firebase';
import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import IStoreState from '../store/IStoreState';
import withAuthorization from './Authentication/withAuthorization';
import PasswordChangeForm from './PasswordChange';
import { PasswordForgetForm } from './PasswordForget';

interface IAccountPageProps {
  authUser: firebase.User
}

const AccountPage = ({ authUser }: { authUser: firebase.User }) =>
    <div>
      <h1 className={'navigationHeader'}>Account: {authUser.email}</h1>
      <PasswordForgetForm />
      <PasswordChangeForm />
    </div>

const mapStateToProps = (state: IStoreState) => ({
  authUser: state.sessionState.authUser,
});

const authCondition = (authUser: firebase.User) => !!authUser && !!authUser.emailVerified;

export default compose<IAccountPageProps, {}>(
  withAuthorization(authCondition),
  connect(mapStateToProps)
)(AccountPage);