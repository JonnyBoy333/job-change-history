import * as React from 'react';
import { Button, FormGroup, Input, Label } from 'reactstrap';

import { ISendAuthMessage, ISubmitAuthCode } from '../../actions/jobActions';
import successImg from '../../images/success.svg';
import './KPayLogin.css';

const serverUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : 'https://kpay-automator.herokuapp.com';

interface I2FAState {
  authMethod: string;
  code: string;
  authMethodError: string;
  authCodeError: string;
}

interface I2FAProps {
  sendAuthMessage: ISendAuthMessage;
  submitAuthCode: ISubmitAuthCode;
  userId: string;
  messageSent: boolean;
  authMethod: string;
}

class KPayLogin extends React.Component<I2FAProps, I2FAState> {

  constructor(props: I2FAProps) {
    super(props);
    
    this.state = {
      authCodeError: '',
      authMethod: this.props.authMethod || '',
      authMethodError: '',
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

  public sendAuthMessage = (event: any) => {
    console.log('Submitting message', this.state);
    const authMethod = this.state.authMethod;
    const userId = this.props.userId;
    // this.props.sendAuthMessage(userId, authMethod)
    event.preventDefault();

    // fetch('/api/start', {
    fetch(`${serverUrl}/api/authmethod?authmethod=${authMethod}&uid=${userId}`)
      .then(res => res.json())
      .then((res) => {
        console.log('Response', res)
        const result = res.result;
        if (result !== 'success') {
          this.setState({ authMethodError: res.error.message });
        }
      })
      .catch((err: Error) => {
        console.log(err);
        this.setState({ authMethodError: err.message });
      });
  }

  public submitAuthCode = (event: any) => {
    const authCode = this.state.code;
    const userId = this.props.userId;
    // this.props.submitAuthCode(userId, authCode);

    event.preventDefault();

    // fetch('/api/start', {
    fetch(`${serverUrl}/api/authcode?authcode=${authCode}&uid=${userId}`)
      .then(res => res.json())
      .then((res) => {
        console.log('Response', res)
        const result = res.result;
        if (result !== 'success') {
          this.setState({ authCodeError: res.error.message });
        }
      })
      .catch((err: Error) => {
        console.log(err.message);
        this.setState({ authCodeError: err.message });
      });
  }

  public render() {

    const labelStyle = {
      color: '#6c757d',
      paddingRight: 10,
    }

    const {
      authMethod,
      code,
      authMethodError,
      authCodeError
    } = this.state;

    const isSendInvalid = authMethod === '' || this.props.messageSent;
    const isSubmitInvalid = code === '';

    function sendButtonText(messageSent: boolean) {
        return messageSent
          ? <div>Sent <img src={successImg} width={15} alt='success' /></div>
          : 'Send'
    }

    return (
      <div className='col-lg-4 offset-lg-4'>
        <p style={{ textAlign: 'left' }}>Your account has Two Factor Authentication, please fill out the information below to continue.</p>
        <form className='form-horizontal'>
          <FormGroup>
            <Label>Preferred Authentication Method</Label>
            <FormGroup check={true} >
              <Label check={true} style={labelStyle}>
                <input
                  type='radio'
                  name='auth-method'
                  value='SMS'
                  checked={this.state.authMethod === 'SMS'}
                  onChange={this.handleOptionChange}
                />{' '}
                Text Message{' '}
              </Label>
              <Label check={true} style={labelStyle}>
                <input
                  type='radio'
                  name='auth-method'
                  value='Voice'
                  checked={this.state.authMethod === 'Voice'}
                  onChange={this.handleOptionChange}
                />{' '}
                Voice{' '}
              </Label>
              <Label check={true} style={labelStyle}>
                <input
                  type='radio'
                  name='auth-method'
                  value='Email'
                  checked={this.state.authMethod === 'Email'}
                  onChange={this.handleOptionChange}
                />{' '}
                Email{' '}
              </Label>
            </FormGroup>
          </FormGroup>
          <Button block={true} disabled={isSendInvalid} color='primary' onClick={this.sendAuthMessage} style={{ marginTop: '20px' }}>{sendButtonText(this.props.messageSent)}</Button>
          {authMethodError && <p className={'error-message'}>{authMethodError}</p>}
          {/* {this.props.messageSent && <img src={successImg} width={10} style={{ marginTop: 10 }} alt='success' />} */}
          <FormGroup>
            <Label for='code'>Code</Label>
            <Input type='text' name='code' id='code' placeholder='12345' onChange={this.onCodeChange} />
          </FormGroup>
          <Button block={true} disabled={isSubmitInvalid} onClick={this.submitAuthCode} style={{ marginTop: '20px' }}>Submit</Button>
          {authCodeError && <p className={'error-message'}>{authCodeError}</p>}
        </form>
      </div>
    );
  }
};

export default KPayLogin;
