import * as React from 'react';
import { Button, FormGroup, Input, Label } from 'reactstrap';

import { auth } from '../firebase';

interface IState {
  error: Error | null;
  passwordOne: string;
  passwordTwo: string;
}

const INITIAL_STATE = {
  error: null,
  passwordOne: '',
  passwordTwo: '',
};

class PasswordChangeForm extends React.Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  public onSubmit = (event: React.FormEvent<EventTarget>) => {
    const { passwordOne } = this.state;

    if (passwordOne) {
      auth.doPasswordUpdate(passwordOne)
        .then(() => {
          this.setState({ ...INITIAL_STATE });
        })
        .catch((error: Error) => {
          this.setState({ error });
        });

      event.preventDefault();
    }
  }

  public onPassOneChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({ passwordOne: event.currentTarget.value });
  public onPassTwoChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({ passwordTwo: event.currentTarget.value });

  public render() {
    const {
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '';

    return (
      <div className='row' style={{ paddingTop: '20px' }}>
        <div className='col-lg-4 offset-lg-4'>
          <form onSubmit={this.onSubmit}>
            <FormGroup style={{ textAlign: 'left' }}>
              <Label>Current Password</Label>
              <Input
                value={passwordOne}
                onChange={this.onPassOneChange}
                type='password'
                placeholder='New Password'
              />
            </FormGroup>
            <FormGroup style={{ textAlign: 'left' }}>
              <Label>New Password</Label>
              <Input
                value={passwordTwo}
                onChange={this.onPassTwoChange}
                type='password'
                placeholder='Confirm New Password'
              />
            </FormGroup>
            <Button disabled={isInvalid} type='submit'>
              Update My Password
            </Button>

            {error && <p>{error.message}</p>}
          </form>
        </div>
      </div>
    );
  }
}

export default PasswordChangeForm;