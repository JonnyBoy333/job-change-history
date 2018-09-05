import * as React from 'react';
import warningPic from '../../images/warning.jpg';
import IStoreState from '../../store/IStoreState';

interface IProgressProps {
  screenshot: IStoreState['job']['screenshot'];
  paused: boolean;
}
const InProgress: React.SFC<IProgressProps> = (props) => {
  const screenshotStyle = {
    border: props.paused ? '5px solid #ffc107' : 'none',
    width: '100%'
  }
  const runningMessage = 'Current Screen:';
  const pausedMessage = props.paused ? <div><img src={warningPic} width={15} />  bot paused, see below for details</div> : '';
  return (
    <div className='col-lg-8 offset-lg-2'>
      <p>{props.paused ?  pausedMessage : runningMessage}</p>
      {props.screenshot && <img src={props.screenshot} style={screenshotStyle} alt='screenshot' />}
    </div>
  );
};

export default InProgress;