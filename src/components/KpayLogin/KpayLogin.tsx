import * as React from 'react';
import ReactDropzone from 'react-dropzone';
import { Button, FormGroup, Input, Label } from 'reactstrap';
// import * as request from 'superagent';

import csvImg from '../../images/csv.png';
import './KPayLogin.css';

interface IZipProps {
  handler: (e: React.FormEvent<EventTarget>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  initialZip: string;
  disabled: boolean;
}

interface IKPayState {
  email: string;
  password: string;
  file: null | File;
  shortname: string;
}

class KPayLogin extends React.Component<IZipProps, IKPayState> {
  constructor(props: IZipProps) {
    super(props);

    this.state = {
      email: '',
      file: null,
      password: '',
      shortname: ''
    };
  }

  public onDrop = (files: File[]) => {

    this.setState({
      file: files[0]
     });
    // POST to a test endpoint for demo purposes
    // const req = request.post('https://httpbin.org/post');

    // files.forEach(file => {
    //   req.attach(file.name, file);
    // });

    // req.end();
  }

  public onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({ email: event.currentTarget.value });
  public onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({ password: event.currentTarget.value });
  public onShortnameChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({ shortname: event.currentTarget.value });

  
  public render() {

    const csvImgStyle = {
      height: 20,
      margin: '-4px 5px 0 0'
    }

    const {
      email,
      password,
      shortname,
      file
    } = this.state;
    
    const isInvalid =
      password === '' ||
      email.indexOf('@') === -1 || 
      shortname === '' ||
      file === null;

    return (
      <div className='col-lg-4 offset-lg-4'>
        <p style={{textAlign: 'left'}}>Please provide your K-Pay login credentials and account information for the account to automate.</p>
        <FormGroup>
          <Label for='email'>Email</Label>
          <Input type='email' name='email' id='email' placeholder='something@gmail.com' onChange={this.onEmailChange} />
        </FormGroup>
        <FormGroup>
          <Label for='password'>Password</Label>
          <Input type='password' name='password' id='password' placeholder='password' onChange={this.onPasswordChange} />
        </FormGroup>
        <FormGroup>
          <Label for='shortname'>Company Shortname</Label>
          <Input type='text' name='shortname' id='shortname' placeholder='CompanyABC' onChange={this.onShortnameChange} />
        </FormGroup>
        <FormGroup check={true}>
          <Input type='checkbox' />
          <Label>No Login Redirect</Label>
        </FormGroup>
        <ReactDropzone
          multiple={false}
          onDrop={this.onDrop}
          className='drop-zone'
          activeClassName='active-drop-zone'
          acceptClassName='accept-drop-zone'
          rejectClassName='reject-drop-zone'
        >
          {file
            ? <div><img src={csvImg} style={csvImgStyle} alt='csvImg' />{file.name}</div>
            : 'Drop your Leader field update list here!'
          }
        </ReactDropzone>
        <Button block={true} disabled={isInvalid} type='submit' style={{marginTop: '20px'}}>Submit</Button>
        {/* <Input onChange={props.onChange} placeholder='Enter K-Pay Email' defaultValue={props.initialZip || ''}/>
          <Input onChange={props.onChange} placeholder='Enter K-Pay Password' defaultValue={props.initialZip || ''}/>
          <Button color='danger' disabled={props.disabled} onClick={props.handler} style={{ marginBottom: 0 }}>Find Ramen!</Button> */}
      </div>
    );
  }
};

export default KPayLogin;