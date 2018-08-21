import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, FormGroup, Input, Label } from 'reactstrap';
import { signUpAsync } from '../actions/authenticationAction';
import * as routes from '../constants/routes';
import IStoreState from '../store/IStoreState';
// import { auth, db } from '../firebase';

interface IParentProps {
  signUpAsync: (username: string, password: string) => void;
  signUpError: null | Error;
}

const SignUpPage = (props: IParentProps) =>
  <div>
    <h1 className={'navigationHeader'}>Sign Up</h1>
    <SignUpForm signUpAsync={props.signUpAsync} signUpError={props.signUpError} />
  </div>

interface IState {
  email: string;
  passwordOne: string;
  passwordTwo: string;
  submitted: boolean;
}

const INITIAL_STATE = {
  email: '',
  passwordOne: '',
  passwordTwo: '',
  submitted: false
};

class SignUpForm extends React.Component<IParentProps, IState> {
  constructor(props: IParentProps) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  public onSubmit = (event: React.FormEvent<EventTarget>) => {
    const { email, passwordOne } = this.state;

    this.props.signUpAsync(email, passwordOne);
    this.setState({
      ...INITIAL_STATE,
      submitted: true
    });

    event.preventDefault();
  }

  public onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({ email: event.currentTarget.value });
  public onPasswordOneChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({ passwordOne: event.target.value });
  public onPasswordTwoChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({ passwordTwo: event.target.value });

  public render() {
    const {
      email,
      passwordOne,
      passwordTwo,
      submitted
    } = this.state;

    const { signUpError } = this.props;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '';

    return (
      <div className='row' style={{ paddingTop: '20px' }}>
        <div className='col-lg-4 offset-lg-4'>
          <form onSubmit={this.onSubmit}>
            <FormGroup style={{ textAlign: 'left' }}>
              <Label>Email</Label>
              <Input
                value={email}
                onChange={this.onEmailChange}
                type='text'
                placeholder='Email Address'
              />
            </FormGroup>
            <FormGroup style={{ textAlign: 'left' }}>
              <Label>Password</Label>
              <Input
                value={passwordOne}
                onChange={this.onPasswordOneChange}
                type='password'
                placeholder='Password'
              />
            </FormGroup>
            <FormGroup style={{ textAlign: 'left' }}>
              <Label>Re-Enter Password</Label>
              <Input
                value={passwordTwo}
                onChange={this.onPasswordTwoChange}
                type='password'
                placeholder='Confirm Password'
              />
            </FormGroup>
            <Button
              block={true}
              disabled={isInvalid}
              type='submit'>
              Sign Up
            </Button>

            {signUpError && <p className={'error-message'}>{signUpError.message}</p>}
            {submitted && !signUpError && <p>Please check your email for a verfication email.</p>}
          </form>
        </div>
      </div>
    );
  }
}

const SignUpLink = () =>
  <p>
    Don't have an account?
    {' '}
    <Link to={routes.SIGN_UP}>Sign Up</Link>
  </p>

interface IStateProps {
  signUpError: null | Error
}

const mapStateToProps = (state: IStoreState): IStateProps => {
  return {
    signUpError: state.sessionState.signUpError
  }
}

// with ownProps
interface IDispatchProps {
  signUpAsync: (username: string, password: string) => any;
}

const mapDispatchToProps = (dispatch: any): any => {
  return {
    signUpAsync: (username: string, password: string) => dispatch(signUpAsync(username, password))
  }
};

export default connect<IStateProps, IDispatchProps>(mapStateToProps, mapDispatchToProps)(SignUpPage);

export {
  SignUpForm,
  SignUpLink,
};