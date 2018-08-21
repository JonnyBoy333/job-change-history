import * as React from 'react';
import { connect } from 'react-redux';
import { NavLink as RRNavLink } from 'react-router-dom';
import {
  Nav,
  Navbar,
  NavItem,
  NavLink
} from 'reactstrap';
// import { default as NavLink } from 'reactstrap/lib/NavLink'; 
class ReactstrapNavLinkRouter extends NavLink< {to?: string} > {}; 
// import SignOutButton from './SignOut';
import { logOut as logOutAction } from '../actions/authenticationAction'
import * as routes from '../constants/routes';
import IStoreState from '../store/IStoreState';

interface IProps {
  authUser: firebase.User | null,
  logOut: () => void
}

const Navigation = (props: IProps) => {
  const { authUser, logOut } = props
  return (
    <div>
      <Navbar style={{backgroundColor:'#7abd43'}} dark={true} expand='md'>
        {authUser && authUser.emailVerified
          ? <NavigationAuth logOut={logOut} />
          : <NavigationNonAuth />
        }
      </Navbar>
    </div>
  )
}

const NavigationAuth = ({ logOut }: { logOut: IProps['logOut'] }) => {
  return (
    <Nav className='ml-auto' navbar={true}>
      {/* <NavItem>
        <NavLink to={routes.LANDING} tag={RRNavLink}>Landing</NavLink>
      </NavItem> */}
      <NavItem>
        <ReactstrapNavLinkRouter to={routes.HOME} tag={RRNavLink}>Home</ReactstrapNavLinkRouter>
      </NavItem>
      <NavItem>
        <ReactstrapNavLinkRouter to={routes.ACCOUNT} tag={RRNavLink}>Account</ReactstrapNavLinkRouter>
      </NavItem>
      <NavItem>
        <ReactstrapNavLinkRouter to={routes.SIGN_IN} tag={RRNavLink} onClick={logOut}>Log Out</ReactstrapNavLinkRouter>
      </NavItem>
    </Nav>
  )
}

const NavigationNonAuth = () =>
  <Nav className='ml-auto' navbar={true}>
    <NavItem>
      <ReactstrapNavLinkRouter to={routes.SIGN_IN} tag={RRNavLink}>Sign In</ReactstrapNavLinkRouter>
    </NavItem>
  </Nav>

interface IStateProps {
  authUser: firebase.User | null;
}

const mapStateToProps = (state: IStoreState): IStateProps => ({
  authUser: state.sessionState.authUser
});

interface IDispatchProps {
  logOut: () => any;
}

const mapDispatchToProps = (dispatch: any): any => {
  return {
    logOut: () => dispatch(logOutAction())
  }
};

export default connect<IStateProps, IDispatchProps>(mapStateToProps, mapDispatchToProps)(Navigation);