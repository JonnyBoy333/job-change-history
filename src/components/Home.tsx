// import * as firebase from 'firebase';
import * as React from 'react';
// import { connect } from 'react-redux';
// import { compose } from 'recompose';

// import IStoreState from '../store/IStoreState';
// import withAuthentication from './Authentication/withAuthentication';
import withAuthorization from './Authentication/withAuthorization';
// import Ramen from './Ramen';
import KpayLogin from './KpayLogin';
// import withAuthorization from './Authentication/withAuthorization';

// interface IHomePageProps {
//   authUser: firebase.User
// }

const Home = () =>
    <KpayLogin />

// const mapStateToProps = (state: IStoreState) => ({
//   authUser: state.sessionState.authUser,
// });

const authCondition = (authUser: firebase.User) => !!authUser && !!authUser.emailVerified;

// export default compose<IHomePageProps, {}>(
//   withAuthorization(authCondition),
//   connect(mapStateToProps)
// )(Home);

export default withAuthorization(authCondition)(Home);