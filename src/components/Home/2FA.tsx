import * as React from 'react';
import { Button, FormGroup, Input, Label } from 'reactstrap';

import { ISubmitAuthCode } from '../../actions/jobActions';
import successImg from '../../images/success.svg';
import warnImg from '../../images/warning.jpg';
import './KPayLogin.css';

interface I2FAState {
  authMethod: string;
  code: string;
}

interface I2FAProps {
  sendAuthMessage: any;
  submitAuthCode: ISubmitAuthCode;
  userId: string;
}

class KPayLogin extends React.Component<I2FAProps, I2FAState> {
  constructor(props:I2FAProps) {
    super(props);

    this.state = {
      authMethod: '',
      code: '',
    };
  }

  public onAuthMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({ authMethod: event.currentTarget.value });
  public onCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({ code: event.currentTarget.value });

  public handleOptionChange = (changeEvent: any) => {
    this.setState({
      authMethod: changeEvent.target.value
    });
  }

  public sendAuthMessage = () => {
    console.log('Submitting message', this.state);
    const authMethod = this.state.authMethod;
    const userId = this.props.userId;
    this.props.sendAuthMessage(userId, authMethod)
  }

  public submitAuthCode = () => {
    const authCode = this.state.code;
    const userId = this.props.userId;
    this.props.submitAuthCode(userId, authCode);
  }

  public render() {

    const labelStyle = {
      color: '#6c757d',
      paddingRight: 10,
    }

    const {
      authMethod,
      code
    } = this.state;

    const isSendInvalid = authMethod === '';
    const isSubmitInvalid = code === '';

    return (
      <div className='col-lg-4 offset-lg-4'>
      <img src={warnImg} height='50px' style={{marginTop: 20}} alt='warning'/>
        <p style={{ textAlign: 'left' }}>Your account has Two Factor Authentication, please fill out the information below to continue.</p>
        <form className='form-horizontal'>
          <FormGroup>
            <Label>Preferred Authentication Method</Label>
            <FormGroup check={true} >
              <Label check={true} style={labelStyle}>
                <input
                  type='radio'
                  name='auth-method'
                  value='text-message'
                  checked={this.state.authMethod === 'text-message'}
                  onChange={this.handleOptionChange}
                />{' '}
                Text Message{' '}
            </Label>
              <Label check={true} style={labelStyle}>
                <input
                  type='radio'
                  name='auth-method'
                  value='voice'
                  checked={this.state.authMethod === 'voice'} 
                  onChange={this.handleOptionChange}
                />{' '}
                Voice{' '}
            </Label>
              <Label check={true} style={labelStyle}>
                <input
                  type='radio'
                  name='auth-method'
                  value='email'
                  checked={this.state.authMethod === 'email'} 
                  onChange={this.handleOptionChange}
                />{' '}
                Email{' '}
            </Label>
            </FormGroup>
          </FormGroup>
          <Button block={true} disabled={isSendInvalid} color='primary' onClick={this.sendAuthMessage} style={{ marginTop: '20px' }}>Send</Button>
          <img src={successImg} height='50px' style={{marginTop: 10}} alt='success'/>
          <FormGroup>
            <Label for='code'>Code</Label>
            <Input type='text' name='code' id='code' placeholder='12345' onChange={this.onCodeChange} />
          </FormGroup>
          <Button block={true} disabled={isSubmitInvalid} onClick={this.submitAuthCode} style={{ marginTop: '20px' }}>Submit</Button>
        </form>
      </div>
    );
  }
};

export default KPayLogin;
