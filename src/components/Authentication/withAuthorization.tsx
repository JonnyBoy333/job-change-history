import * as firebase from 'firebase';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import IStoreState from '../../store/IStoreState';

import * as routes from '../../constants/routes';
import { firebase as fb } from '../../firebase';

interface IWithAuthorization extends RouteComponentProps<{}> {
  authUser: firebase.User;
}

const withAuthorization = (authCondition: (authUser: firebase.User | null) => boolean) => (Component: React.ComponentClass | React.StatelessComponent) => {
  class WithAuthorization extends React.Component<IWithAuthorization> {
    public componentDidMount() {

      // const { authUser } = this.props;
      // if (!authCondition(authUser)) {
      //   console.log('Auth User', authUser);
      //   // console.log(authUser.emailVerified);
      //   // console.log(!!authUser && !!authUser.emailVerified);
      //   this.props.history.push(routes.SIGN_IN);
      // }
      fb.auth.onAuthStateChanged(authUser => {
        if (!authCondition(authUser)) {
          this.props.history.push(routes.SIGN_IN);
        }
      });
    }

    public render() {
      return this.props.authUser ? <Component /> : null;
    }
  }

  const mapStateToProps = (state: IStoreState) => ({
    authUser: state.sessionState.authUser,
  });

  return compose(
    withRouter,
    connect(mapStateToProps),
  )(WithAuthorization);
}

export default withAuthorization;