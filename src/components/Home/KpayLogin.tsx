import * as React from 'react';
import ReactDropzone from 'react-dropzone';
import { Button, FormGroup, Input, Label } from 'reactstrap';

import { IStartJob } from '../../actions/jobActions';
import csvImg from '../../images/csv.png';
import './KPayLogin.css';

const serverUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : 'https://kpay-automator.herokuapp.com';

interface IKPayLoginProps {
  startJob: IStartJob
  uid: string;
}

interface IKPayState {
  username: string;
  password: string;
  file: null | File;
  rejectedFile: null | File;
  filesWereDropped: boolean;
  shortname: string;
  startJobError: string;
  loginredirect: boolean;
}

class KPayLogin extends React.Component<IKPayLoginProps, IKPayState> {
  constructor(props: IKPayLoginProps) {
    super(props);

    this.state = {
      file: null,
      rejectedFile: null,
      filesWereDropped: true,
      loginredirect: false,
      password: '',
      shortname: '',
      startJobError: '',
      username: '',
    };
  }

  // public onDrop = (files: File[]) => {

  //   this.setState({
  //     file: files[0]
  //   });
  // }
  // public onClick = () => {
  //   console.log('Clicked');
  //   this.setState({ filesWereDropped: false })
  // }

  public onDrop = (acceptedFiles: File[], rejectedFiles: any, e: any) => {
    console.log(acceptedFiles);
    console.log(rejectedFiles);
    console.log(e);
    const fileName = acceptedFiles[0].name;
    const extension = fileName.substr(fileName.length - 4);
    console.log('Extension', extension);
    if (fileName.substr(fileName.length - 4) !== '.csv') {
      console.log('Incorrect File Type');
      this.setState({ rejectedFile: acceptedFiles[0], file: null });
    } else {
      this.setState({ file: acceptedFiles[0], rejectedFile: null })
    }
    // this.setState({
    //   file: acceptedFiles[0],
    //   filesWereDropped: !e.target.files || e.target.files.length === 0
    // });
  }

  public onUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({ username: event.currentTarget.value });
  public onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({ password: event.currentTarget.value });
  public onShortnameChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({ shortname: event.currentTarget.value });

  public handleSubmit = (event: any) => {
    event.preventDefault();
    const data = new FormData(event.target);
    data.append('uid', this.props.uid);
    if (this.state.filesWereDropped && this.state.file) {
      data.append('leader-list', this.state.file, this.state.file.name);
    }

    // fetch('/api/start', {
    fetch(`${serverUrl}/api/start`, {
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
      .catch((err: Error) => {
        console.log(err)
        this.setState({ startJobError: err.message });
      });
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
      startJobError,
      rejectedFile
    } = this.state;

    const isInvalid =
      password === '' ||
      username === '' ||
      shortname === '' ||
      file === null;

    return (
      <div className='col-lg-4 offset-lg-4'>
        <p style={{ textAlign: 'left' }}>Please provide your K-Pay login credentials and account information for the account to automate.</p>
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
            <Input type='checkbox' name='loginredirect' id='loginredirect' />
            <Label>Has Login Redirect</Label>
          </FormGroup>
          <ReactDropzone
            name='leader-list'
            multiple={false}
            onDrop={this.onDrop}
            className={rejectedFile ? 'drop-zone reject-drop-zone' : 'drop-zone'}
            activeClassName='active-drop-zone'
            acceptClassName='accept-drop-zone'
            rejectClassName='reject-drop-zone'
          >
            {file
              ? <div><img src={csvImg} style={csvImgStyle} alt='csvImg' />{file.name}</div>
              : rejectedFile 
                ? `"${rejectedFile.name}" is not a CSV file. Please select a CSV file.`
                : 'Drop your Leader field update list here!'
            }
          </ReactDropzone>
          <Button block={true} disabled={isInvalid} type='submit' style={{ marginTop: '20px' }}>Submit</Button>
          {startJobError && <p className={'error-message'}>{startJobError}</p>}
        </form>
      </div>
    );
  }
};

export default KPayLogin;
