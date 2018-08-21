import { History } from 'history';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Button } from 'reactstrap';
import { signUpAsync } from '../actions/authenticationAction';
import * as routes from '../constants/routes';

interface IMyProps extends RouteComponentProps<{bingo: string}> {}

const SignUpPage = (props: IMyProps) => {
  return (
    <div>
      <h1 className={'navigationHeader'}>Sign Up</h1>
      <SignUpForm history={props.history} />
    </div>
  )
}

interface IState {
  error: Error | null;
}

class SignUpForm extends React.Component<{ history: History }, IState> {
  constructor(props: { history: History }) {
    super(props);

    this.state = { error: null };
  }

  public onSubmit = (event: React.FormEvent<EventTarget>) => {

    this.props.history.push(routes.HOME)
    event.preventDefault();
  }

  public render() {
    const {
      error,
    } = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        <Button block={true} type='submit'>Sign Up</Button>
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

interface IDispatchProps {
  signUpAsync: (username: string, password: string) => any;
}

const mapDispatchToProps = (dispatch: any): any => {
  return {
    signUpAsync: (username: string, password: string) => dispatch(signUpAsync(username, password))
  }
};

export default withRouter(
  connect<{}, IDispatchProps>(null, mapDispatchToProps)(SignUpPage)
);