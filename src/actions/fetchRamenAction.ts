import { Dispatch } from 'redux';
import { fetchRamenAPI } from '../api/ramenApi';
import { db } from '../firebase';
import IStoreState, { IRamen } from '../store/IStoreState';
import { ActionTypeKeys as keys } from './ActionTypeKeys';
import { ActionTypes, IFetchRamenFailAction, IFetchRamenInProgressAction, IFetchRamenSuccessAction} from './ActionTypes';

export function fetchRamen(id: string, zip: string): (dispatch: Dispatch<ActionTypes>, getState: () => IStoreState) => Promise<void>  {
  return async (dispatch: Dispatch<IFetchRamenInProgressAction | IFetchRamenSuccessAction | IFetchRamenFailAction>, getState: () => IStoreState) =>  {

    const pendingFetch = getState().pendingActions.fetchRamen;

    if (!pendingFetch) {
      dispatch(fetchRamenInProgress())
      try {
        const ramenPayload = await fetchRamenAPI(zip);
        
        await db.saveZip(id, zip);
        dispatch(fetchRamenSuccess(ramenPayload));
      } catch (err) {
        dispatch(fetchRamenFail(err));
      }
    } else {
      dispatch(fetchRamenInProgress())
    }
  }
}

export function fetchRamenSuccess(payload: IRamen[]): IFetchRamenSuccessAction {
  return {
    payload,
    type: keys.FETCH_RAMEN_SUCCESS,
  }
}

export function fetchRamenInProgress(): IFetchRamenInProgressAction {
  return {
    type: keys.FETCH_RAMEN_INPROGRESS
  }
}

export function fetchRamenFail(error: Error): IFetchRamenFailAction {
  return {
    payload: error,
    type: keys.FETCH_RAMEN_FAIL
  }
}