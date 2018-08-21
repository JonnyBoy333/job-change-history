import * as React from 'react';
import { connect } from 'react-redux';
// import { compose } from 'recompose';
import { fetchRamen } from '../../actions/fetchRamenAction';
import { db } from '../../firebase'
import IStoreState, { IRamen } from '../../store/IStoreState';
// import withAuthorization from '../Authentication/withAuthorization';
import InProgress from './InProgress';
import RamenList from './RamenList';
import ZipCode from './ZipCode';

export interface IRamenProps {
  fetchRamen: (id: string, zip: string) => any;
  ramenListings: IRamen[] | Error;
  disabled: boolean;
  authUser: firebase.User | null
}

export interface IRamenState {
  zip: string;
  initialZip: string;
}

class Ramen extends React.Component<IRamenProps, IRamenState> {

  constructor(props: IRamenProps) {
    super(props);

    this.state = { 
      initialZip: '',
      zip: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.fetchRamen = this.fetchRamen.bind(this);
    this.isLoading = this.isLoading.bind(this);
    this.isZipLoading = this.isZipLoading.bind(this);
  }

  public componentDidMount() {
    if (this.props.authUser) {
      db.getZip(this.props.authUser.uid)
        .then(snapshot => {
          this.setState({ zip: snapshot.val().zip});
          this.setState({ initialZip: '12345'});
        })
        .catch(err => {
          this.setState({ initialZip: '12345'})
        })
    }
  }

  public handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ zip: e.target.value });
  }

  public render() {
    return (
      <div>
        <h1 className={'navigationHeader'}>Find That Ramen</h1>
        <div className='row' style={{ paddingTop: '20px' }}>
          {this.isZipLoading()}
          {/* <ZipCode handler={this.fetchRamen} onChange={this.handleChange} disabled={this.props.disabled} initialZip={this.state.zip} /> */}
        </div>
        <div className='row' style={{ paddingTop: '20px' }}>
          {this.isLoading()}
        </div>
      </div>
    );
  }

  private fetchRamen() {
    if (this.props.authUser) {
      this.props.fetchRamen(this.props.authUser.uid, this.state.zip);
    }
  }

  private isLoading() {
    return this.props.disabled ?
      <InProgress /> :
      Array.isArray(this.props.ramenListings) ? 
        <RamenList list={this.props.ramenListings} /> :
        <div>Error</div>;
  }

  private isZipLoading() {
    // console.log('Initial Zip', this.state.initialZip);
    return !this.state.initialZip ?
      <InProgress />  :
      <ZipCode handler={this.fetchRamen} onChange={this.handleChange} disabled={this.props.disabled} initialZip={this.state.zip} />
  }
}

interface IStateProps {
  ramenListings: IRamen[] | Error;
  disabled: boolean;
  authUser: firebase.User | null
}

const mapStateToProps = (state: IStoreState): IStateProps => {
  return {
    authUser: state.sessionState.authUser,
    disabled: state.pendingActions.fetchRamen,
    ramenListings: state.ramen,
  }
}

// with ownProps
interface IDispatchProps {
  fetchRamen: (id: string, zip: string) => any;
}

const mapDispatchToProps = (dispatch: any): any => {
  return {
    fetchRamen: (id: string, zip: string) => dispatch(fetchRamen(id, zip))
  }
};

// const authCondition = (authUser: firebase.User) => !!authUser;

// export default compose<IRamenProps, {}>(
//   withAuthorization(authCondition),
//   connect<IStateProps, IDispatchProps>(mapStateToProps, mapDispatchToProps)
// )(Ramen)

export default connect<IStateProps, IDispatchProps>(mapStateToProps, mapDispatchToProps)(Ramen)

