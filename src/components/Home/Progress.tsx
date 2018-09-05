import * as React from 'react';
import { Progress } from 'reactstrap';
import IStoreState from '../../store/IStoreState';

interface IProgressProps {
  progress: IStoreState['job']['progress'];
  paused: IStoreState['job']['paused'];
}
const InProgress: React.SFC<IProgressProps> = (props) => {
  const getColor = () => {
    let color = 'secondary';
    if (props.progress.percent > 0) { color = 'primary' }
    if (props.paused) { color = 'warning' }
    if (props.progress.percent === 100) { color = 'success' }
    return color;
  }

  const getAnimated = () => {
    let animated = true;
    if (props.paused) { animated = false }
    if (props.progress.percent === 100) { animated = false }
    return animated;
  }
  return (
    <div className='col-lg-4 offset-lg-4'>
      <Progress 
        animated={getAnimated()}
        striped={true}
        color={getColor()}
        value={props.progress.percent > 0 ? props.progress.percent : 100}>{props.progress.percent}% ({props.progress.processed}/{props.progress.total})
      </Progress>
    </div>
  );
};

export default InProgress;