import * as React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import './App.css';
import logo from './images/k-pay-logo.png';

import AccountPageComp from './components/Account';
import HomeComp from './components/Home';
// import LandingPageComp from './components/Landing';
import Navigation from './components/Navigation';
import PasswordForgetPageComp from './components/PasswordForget';
import SignInPageComp from './components/SignIn';
import SignUpPageComp from './components/SignUp';

import withAuthentication from './components/Authentication/withAuthentication';
import * as routes from './constants/routes';

// const LandingPage = () => <LandingPageComp />;
const SignupPage = () => <SignUpPageComp />;
const SignInPage = () => <SignInPageComp />;
const PasswordForgetPage = () => <PasswordForgetPageComp />;
const Home = () => <HomeComp />;
const AccountPage = () => <AccountPageComp />;

class App extends React.Component {
  public render() {
    return (
      <Router>
        <div className='App'>
          <Navigation />
          <header className='App-header'>
            <img src={logo} className='App-logo' alt='logo' />
            <h1 className='App-title'>K-Pay Automator</h1>
          </header>
          <div className='container'>

            <Route
              exact={true} path={routes.LANDING}
              component={Home}
            />
            <Route
              exact={true} path={routes.SIGN_UP}
              component={SignupPage}
            />
            <Route
              exact={true} path={routes.SIGN_IN}
              component={SignInPage}
            />
            <Route
              exact={true} path={routes.PASSWORD_FORGET}
              component={PasswordForgetPage}
            />
            <Route
              exact={true} path={routes.HOME}
              component={Home}
            />
            <Route
              exact={true} path={routes.ACCOUNT}
              component={AccountPage}
            />
          </div>
        </div>
      </Router>
    );
  }
}

export default withAuthentication(App);
