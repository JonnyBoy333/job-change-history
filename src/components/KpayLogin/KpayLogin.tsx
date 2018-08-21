import * as React from 'react';
import ReactDropzone from 'react-dropzone';
import { Button, FormGroup, Input, Label } from 'reactstrap';
import * as request from 'superagent';

import './KPayLogin.css';

export interface IZipProps {
  handler: (e: React.FormEvent<EventTarget>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  initialZip: string;
  disabled: boolean;
}

const KpayLogin: React.SFC<IZipProps> = (props) => {
  const onDrop = (files: File[]) => {
    // POST to a test endpoint for demo purposes
    const req = request.post('https://httpbin.org/post');

    files.forEach(file => {
      req.attach(file.name, file);
    });

    req.end();
  }

  return (
    <div className='col-lg-4 offset-lg-4'>
      <FormGroup>
        <Label for='email'>Email</Label>
        <Input type='email' name='email' id='email' placeholder='something@gmail.com' />
      </FormGroup>
      <FormGroup>
        <Label for='password'>Password</Label>
        <Input type='text' name='password' id='password' placeholder='password' />
      </FormGroup>
      <FormGroup>
        <Label for='shortname'>Company Shortname</Label>
        <Input type='text' name='shortname' id='shortname' placeholder='CompanyABC' />
      </FormGroup>
      <FormGroup check={true}>
        <Input type='checkbox' />
        <Label>No Login Redirect</Label>
      </FormGroup>
      <ReactDropzone onDrop={onDrop} className='drop-zone'>
          Drop your Leader field update list here!
      </ReactDropzone>
      <Button block={true} disabled={true} type='submit' style={{marginTop: '20px'}}>Submit</Button>
      {/* <Input onChange={props.onChange} placeholder='Enter K-Pay Email' defaultValue={props.initialZip || ''}/>
        <Input onChange={props.onChange} placeholder='Enter K-Pay Password' defaultValue={props.initialZip || ''}/>
        <Button color='danger' disabled={props.disabled} onClick={props.handler} style={{ marginBottom: 0 }}>Find Ramen!</Button> */}
    </div>
  );
};

export default KpayLogin;
