import * as React from 'react';
import { Progress } from 'reactstrap';

const InProgress: React.SFC<{}> = (props) => {
  return (
    <div className='col-lg-4 offset-lg-4'>
      <Progress animated={true} striped={true} color="info" value={50}>50% (50/100)</Progress>
    </div>
  );
};

export default InProgress;