import * as React from 'react';
import logo from '../../images/test-screenshot.png';

const InProgress: React.SFC<{}> = (props) => {
  const screenshotStyle = {
    width: '100%'
  }
  return (
    <div className='col-lg-4 offset-lg-4'>
      <p>Current Screen:</p>
      <img src={logo} style={screenshotStyle} alt='loading...' />
    </div>
  );
};

export default InProgress;