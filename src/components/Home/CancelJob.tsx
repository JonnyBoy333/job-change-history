import * as React from 'react';
import { Button } from 'reactstrap';
import { ICancelJob } from '../../actions/jobActions';

interface ICancelJobProps {
  cancelJob: ICancelJob,
  uid: string;
  completed: boolean;
}


const InProgress: React.SFC<ICancelJobProps> = (props) => {

  const cancelJob = (event: any) => {
    event.preventDefault();
    props.cancelJob(props.uid)
  };
  return (
    <div className='col-lg-4 offset-lg-4'>
      <Button block={true} type='submit' color={'danger'} style={{marginTop: '20px'}} onClick={cancelJob}>{props.completed ? 'Reset' : 'Cancel Job'}</Button>
    </div>
  );
};

export default InProgress;