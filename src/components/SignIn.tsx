import { History } from 'history';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Button, FormGroup, Input, Label } from 'reactstrap';
import { signInAsync } from '../actions/authenticationAction'
import * as routes from '../constants/routes';
// import { auth } from '../firebase';
import IStoreState from '../store/IStoreState';
import { PasswordForgetLink } from './PasswordForget';
import { SignUpLink } from './SignUp';

interface IParentProps extends RouteComponentProps<{}> {
  signInAsync: (username: string, password: string) => Promise<void>;
  signInError: null | Error;
  authUser: firebase.User | null;
}

const SignInPage = (props: IParentProps) =>
  <div>
    <h1 className={'navigationHeader'}>Sign In</h1>
    <SignInForm history={props.history} signInAsync={props.signInAsync} signInError={props.signInError} authUser={props.authUser} />
    <PasswordForgetLink />
    <SignUpLink />
  </div>

interface IState {
  email: string;
  error: Error | null;
  password: string;
}

const INITIAL_STATE = {
  email: '',
  error: null,
  password: '',
};

interface IChildProps {
  signInAsync: (username: string, password: string) => Promise<void>;
  authUser: firebase.User | null;
  signInError: null | Error;
  history: History;
}

class SignInForm extends React.Component<IChildProps, IState> {
  constructor(props: IChildProps) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  // public componentWillMount() {
  //   console.log('Auth User', this.props.authUser);
  //   if (this.props.authUser && this.props.authUser.emailVerified) {
  //     this.props.history.push(routes.HOME);
  //   }
  // }

  public onSubmit = (event: React.FormEvent<EventTarget>) => {
    const {
      email,
      password,
    } = this.state;

    const {
      history,
    } = this.props;

    this.props.signInAsync(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        history.push(routes.HOME);
      })

    event.preventDefault();
  }

  public onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({ email: event.currentTarget.value });
  public onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({ password: event.currentTarget.value });

  public render() {
    const {
      email,
      password
    } = this.state;

    const { signInError } = this.props;

    const isInvalid =
      password === '' ||
      email === '';

    return (
      <div className='row' style={{ paddingTop: '20px' }}>
        <div className='col-lg-4 offset-lg-4'>
          <form onSubmit={this.onSubmit}>
            <FormGroup>
              <Label>Email</Label>
              <Input
                autoFocus={true}
                type='email'
                value={email}
                onChange={this.onEmailChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Password</Label>
              <Input
                value={password}
                onChange={this.onPasswordChange}
                type='password'
              />
            </FormGroup>
            <Button
              block={true}
              disabled={isInvalid}
              type='submit'
            >
              Login
          </Button>
          </form>
          {signInError && <p className={'error-message'}>{signInError.message}</p>}
        </div>
      </div>
    );
  }
}

interface IStateProps {
  signInError: null | Error;
  authUser: null | firebase.User;
}

const mapStateToProps = (state: IStoreState): IStateProps => {
  return {
    authUser: state.sessionState.authUser,
    signInError: state.sessionState.signInError
  }
}

// with ownProps
interface IDispatchProps {
  signInAsync: (username: string, password: string) => Promise<void>;
}

const mapDispatchToProps = (dispatch: any): any => {
  return {
    signInAsync: (username: string, password: string) => dispatch(signInAsync(username, password))
  }
};

export default withRouter(
  connect<IStateProps, IDispatchProps>(mapStateToProps, mapDispatchToProps)(SignInPage)
);

export {
  SignInForm,
};