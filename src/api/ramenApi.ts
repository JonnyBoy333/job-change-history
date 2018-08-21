// import { firebase } from '../firebase';
import { IRamen } from '../store/IStoreState';

// export function fetchRamenAPI(zip: string): Promise<IRamen[]> {
//   return fetch(`./api/ramen?zip=${zip}`)
//     .then(res => res.json())
//     .then(res => res.businesses)
// }

export function fetchRamenAPI(zip: string): Promise<IRamen[]> {
  // const getRamen = firebase.functions.httpsCallable('getRamen');
  // getRamen({ zip })
  return fetch(`./api/ramen?zip=${zip}`)
    .then(res => res.json())
    .then(res => res.businesses)
}