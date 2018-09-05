import * as assert from 'assert';
import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { cancelJob, errorJob, ICancelJob, IErrorJob, IPauseJob, ISendAuthMessage, IStartJob, ISubmitAuthCode, IUpdate2FA, IUpdateProgress, IUpdateScreenshot, pauseJob, sendAuthMessage, startJob, submitAuthCode, update2FA, updateProgress, updateScreenshot } from '../../actions/jobActions';
import { db } from '../../firebase'
import IStoreState from '../../store/IStoreState';
import withAuthorization from '../Authentication/withAuthorization';
import TwoFA from './2FA';
import CancelJob from './CancelJob';
import KpayLogin from './KpayLogin';
import Progress from './Progress';
import Screenshot from './Screenshot';

interface IHomePageProps {
  job: IStoreState['job'];
  startJob: IStartJob;
  update2FA: IUpdate2FA;
  updateProgress: IUpdateProgress;
  updateScreenshot: IUpdateScreenshot;
  authUser: firebase.User;
  sendAuthMessage: ISendAuthMessage;
  submitAuthCode: ISubmitAuthCode;
  cancelJob: ICancelJob;
  pauseJob: IPauseJob;
  errorJob: IErrorJob;
}

interface IHomePageState {
  messageSent: boolean;
}

// const Home = (props: IHomePageProps) => {
class Home extends React.Component<IHomePageProps, IHomePageState> {
  constructor(props: IHomePageProps) {
    super(props);

    this.state = { messageSent: false };
    // this.handleChange = this.handleChange.bind(this);
    // this.fetchRamen = this.fetchRamen.bind(this);
    // this.isLoading = this.isLoading.bind(this);
    // this.isZipLoading = this.isZipLoading.bind(this);
  }

  public componentDidMount() {

    db.getJob(this.props.authUser.uid, (job) => {
      console.log('Firebase Job', job);
      console.log('Local Job', this.props.job);
      if (job) {
        if (job['2FA'].messageSent !== null && job['2FA'].messageSent !== this.state.messageSent) {
          console.log('Message Sent', job['2FA'].messageSent);
          this.setState({ messageSent: job['2FA'].messageSent });
          // db.updateMessageSent(this.props.authUser.uid, false);
        }
        if (job.started !== null && (job.started !== this.props.job.started)) {
          console.log('Started changed');
          this.props.startJob(job.started);
        }
        if (job['2FA'] && ((job['2FA'].has2FA !== this.props.job['2FA'].has2FA) || (job['2FA'].defeated !== this.props.job['2FA'].defeated))) {
          console.log('2FA changed');
          this.props.update2FA(job['2FA']);
        }
        if (job.progress && !deepEqual(job.progress, this.props.job.progress)) {
          console.log('Progress changed');
          this.props.updateProgress(job.progress);
        }
        if (job.screenshot !== null && (job.screenshot !== this.props.job.screenshot)) {
          console.log('Screenshot changed');
          this.props.updateScreenshot(job.screenshot);
        }
        if (job.paused !== null && (job.paused !== this.props.job.paused)) {
          console.log('Job Paused');
          this.props.pauseJob(job.paused);
        }
        if (job.errored !== null && (job.errored !== this.props.job.errored)) {
          console.log('Job Errored');
          this.props.errorJob(job.errored);
        }
      }
    });
    // fb.auth.onAuthStateChanged(authUser => {
    //   console.log('With Authentication User', authUser);
    //   if (authUser && authUser.emailVerified) {
    //     onSetAuthUser(authUser)
    //   } else {
    //     onSetAuthUser(null);
    //   }
    // })
  }

  public getHeaderText() {
    let headerText = 'K-Pay Login';
    if (this.props.job.started) { headerText = 'Job In Progress' }
    if (this.props.job.progress.percent === 100) { headerText = 'Job Complete!' }
    return headerText;
  }

  public render() {

    return (
      <div>
        <h1 className={'navigationHeader'}>{this.getHeaderText()}</h1>
        <div className='row' style={{ paddingTop: '20px' }}>
          {this.isJobStarted(<KpayLogin startJob={this.props.startJob} uid={this.props.authUser.uid} />, false)}
          {this.isJobStarted(<Progress progress={this.props.job.progress} paused={this.props.job.paused} />, true)}
          {this.isJobStarted(<Screenshot screenshot={this.props.job.screenshot} paused={this.props.job.paused} />, true)}
          {this.has2FA(<TwoFA sendAuthMessage={this.props.sendAuthMessage} submitAuthCode={this.props.submitAuthCode} userId={this.props.authUser.uid} messageSent={this.state.messageSent} authMethod={this.props.job['2FA'].authMethod} />)}
          {this.isJobStarted(<CancelJob cancelJob={this.props.cancelJob} uid={this.props.authUser.uid} completed={this.props.job.progress.percent === 100} />, true)}
        </div>
      </div>
    )
  }
  private isJobStarted(component: any, condition: boolean) {
    return this.props.job.started === condition ? component : null;
  }
  private has2FA(component: any) {
    return this.props.job.started && this.props.job['2FA'].has2FA && !this.props.job['2FA'].defeated
      ? component
      : null;
  }
}

function deepEqual(a: {}, b: {}) {
  try {
    assert.deepEqual(a, b);
  } catch (error) {
    if (error.name === 'AssertionError') {
      return false;
    }
    throw error;
  }
  return true;
};


const mapStateToProps = (state: IStoreState) => ({
  authUser: state.sessionState.authUser,
  job: state.job,
});

const mapDispatchToProps = (dispatch: any): any => ({
  cancelJob: (uid: string) => dispatch(cancelJob(uid)),
  sendAuthMessage: (id: string, authMethod: IStoreState['job']['2FA']['authMethod']) => dispatch(sendAuthMessage(id, authMethod)),
  startJob: (started: IStoreState['job']['started']) => dispatch(startJob(started)),
  submitAuthCode: (id: string, code: IStoreState['job']['2FA']['code']) => dispatch(submitAuthCode(id, code)),
  update2FA: (twoFA: IStoreState['job']['2FA']) => dispatch(update2FA(twoFA)),
  updateProgress: (progress: IStoreState['job']['progress']) => dispatch(updateProgress(progress)),
  updateScreenshot: (screenshot: IStoreState['job']['screenshot']) => dispatch(updateScreenshot(screenshot)),
  pauseJob: (paused: IStoreState['job']['paused']) => dispatch(pauseJob(paused)),
  errorJob: (errored: IStoreState['job']['errored']) => dispatch(errorJob(errored))
});

const authCondition = (authUser: firebase.User) => !!authUser && !!authUser.emailVerified;

export default compose<IHomePageProps, {}>(
  withAuthorization(authCondition),
  connect(mapStateToProps, mapDispatchToProps)
)(Home);

// export default withAuthorization(authCondition)(Home);