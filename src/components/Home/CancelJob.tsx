import * as React from 'react';
import { Button } from 'reactstrap';

const InProgress: React.SFC<{}> = (props) => {
  return (
    <div className='col-lg-4 offset-lg-4'>
      <Button block={true} type='submit' color={'danger'} style={{marginTop: '20px'}}>Cancel Job</Button>
    </div>
  );
};

export default InProgress;