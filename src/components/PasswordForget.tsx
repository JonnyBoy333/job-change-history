import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button, FormGroup, Input, Label } from 'reactstrap';

import { auth } from '../firebase';

const PasswordForgetPage = () =>
  <div>
    <h1 className={'navigationHeader'}>Forgot Password</h1>
    <PasswordForgetForm />
  </div>

// const byPropKey = (propertyName: 'email' | 'error', value: any) => () => ({
//   [propertyName]: value,
// });

const INITIAL_STATE = {
  email: '',
  error: null,
};

interface IState {
  email: string;
  error: Error | null
}

class PasswordForgetForm extends React.Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  public onSubmit = (event: React.FormEvent<EventTarget>) => {
    const { email } = this.state;

    auth.doPasswordReset(email)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
      })
      .catch((error: Error) => {
        this.setState({ error });
      });

    event.preventDefault();
  }

  public handleChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({ email: event.currentTarget.value });

  public render() {
    const {
      email,
      error,
    } = this.state;

    const isInvalid = email === '';

    return (
      <div className='row' style={{ paddingTop: '20px' }}>
        <div className='col-lg-4 offset-lg-4'>
          <form onSubmit={this.onSubmit}>
            <FormGroup style={{ textAlign: 'left' }}>
              <Label>Email</Label>
              <Input
                value={this.state.email}
                onChange={this.handleChange}
                type='text'
                placeholder='Email Address'
              />
            </FormGroup>
            <Button disabled={isInvalid} type='submit'>
              Reset My Password
            </Button>

            {error && <p>{error.message}</p>}
          </form>
        </div>
      </div>
    );
  }
}

const PasswordForgetLink = () =>
  <p>
    <Link to='/pw-forget'>Forgot Password?</Link>
  </p>

export default PasswordForgetPage;

export {
  PasswordForgetForm,
  PasswordForgetLink,
};