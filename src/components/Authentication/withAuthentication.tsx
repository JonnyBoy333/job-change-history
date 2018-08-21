import * as firebase from 'firebase';
import * as React from 'react';
import { connect } from 'react-redux';
import { authSetUserAsync } from '../../actions/authenticationAction';
import { firebase as fb } from '../../firebase';
import IStoreState from '../../store/IStoreState';

interface IAuthenticationProps {
  onSetAuthUser: (authUser: firebase.User | null) => any;
  authUser: firebase.User | null;
}

const withAuthentication = (Component: React.ComponentClass | React.StatelessComponent) => {
  class WithAuthentication extends React.Component<IAuthenticationProps> {

    public componentDidMount() {
      const { onSetAuthUser } = this.props;

        // if (authUser && authUser.emailVerified) {
        //   onSetAuthUser(authUser)
        // } else {
        //   onSetAuthUser(null);
        // }

      fb.auth.onAuthStateChanged(authUser => {
        console.log('With Authentication User', authUser);
        if (authUser && authUser.emailVerified) {
          onSetAuthUser(authUser)
        } else {
          onSetAuthUser(null);
        }
      })
    }

    public render() {
      return (
        <Component />
      );
    }
  }

  const mapStateToProps = (state: IStoreState) => ({
    authUser: state.sessionState.authUser
  })

  const mapDispatchToProps = (dispatch: any) => ({
    onSetAuthUser: (authUser: firebase.User) => dispatch(authSetUserAsync(authUser)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(WithAuthentication);
}

export default withAuthentication;