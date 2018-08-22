import * as React from 'react';
import ReactDropzone from 'react-dropzone';
import { Button, FormGroup, Input, Label } from 'reactstrap';

import { IStartJob } from '../../actions/jobActions';
import csvImg from '../../images/csv.png';
import './KPayLogin.css';

// interface IZipProps {
//   initialState: IKPayState | null;
// }

interface IKPayLoginProps {
  startJob: IStartJob
}

interface IKPayState {
  username: string;
  password: string;
  file: null | File;
  shortname: string;
  startJobError: string;
  loginredirect: boolean;
}

class KPayLogin extends React.Component<IKPayLoginProps, IKPayState> {
  constructor(props: IKPayLoginProps) {
    super(props);

    this.state = {
      file: null,
      loginredirect: false,
      password: '',
      shortname: '',
      startJobError: '',
      username: '',
    };
  }

  public onDrop = (files: File[]) => {

    this.setState({
      file: files[0]
     });
  }

  public onUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({ username: event.currentTarget.value });
  public onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({ password: event.currentTarget.value });
  public onShortnameChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({ shortname: event.currentTarget.value });

  public handleSubmit(event: any) {
    event.preventDefault();
    const data = new FormData(event.target);
    
    fetch('/api/start', {
      body: data,
      method: 'POST',
    })
    .then(res => res.json())
    .then((res) => {
      console.log('Response', res)
      const result = res.result;
      if (result === 'success') {
        this.props.startJob(true);
      } else {
        this.setState({ startJobError: res.error.message });
      }
    })
    .catch(err => console.log(err));
  }

  
  public render() {

    const csvImgStyle = {
      height: 20,
      margin: '-4px 5px 0 0'
    }

    const {
      username,
      password,
      shortname,
      file,
      startJobError
    } = this.state;
    
    const isInvalid =
      password === '' ||
      username === '' || 
      shortname === '' ||
      file === null;

    return (
      <div className='col-lg-4 offset-lg-4'>
        <p style={{textAlign: 'left'}}>Please provide your K-Pay login credentials and account information for the account to automate.</p>
        <form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label for='username'>Username</Label>
            <Input type='text' name='username' id='username' placeholder='bob1234' onChange={this.onUsernameChange} />
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
            <Input type='checkbox' name='loginredirect' id='loginredirect'/>
            <Label>Has Login Redirect</Label>
          </FormGroup>
          <ReactDropzone
            name='leader-list'
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
          {startJobError && <p className={'error-message'}>{startJobError}</p>}
        </form>
      </div>
    );
  }
};

export default KPayLogin;
