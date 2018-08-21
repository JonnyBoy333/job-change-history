import * as React from 'react';
import logo from '../../images/ramen-icon.png';
import './InProgress.css';

const InProgress: React.SFC<{}> = (props) => {
  return (
    <div className='col-lg-4 offset-lg-4'>
      <img src={logo} className='loading-animation' alt='loading...' />
    </div>
  );
};

export default InProgress;