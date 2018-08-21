import * as React from 'react';
import { Button, Input, InputGroup, InputGroupAddon } from 'reactstrap';

export interface IZipProps {
  handler: (e: React.FormEvent<EventTarget>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  initialZip: string;
  disabled: boolean;
}

const Zip: React.SFC<IZipProps> = (props) => {
  return (
    <div className='col-lg-4 offset-lg-4'>
      <InputGroup>
        <Input onChange={props.onChange} placeholder='Enter Zip Code' defaultValue={props.initialZip || ''}/>
        <InputGroupAddon addonType='append'>
          <Button color='danger' disabled={props.disabled} onClick={props.handler} style={{ marginBottom: 0 }}>Find Ramen!</Button>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
};

export default Zip;
