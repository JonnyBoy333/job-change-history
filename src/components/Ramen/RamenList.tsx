import * as React from 'react';
import { Table } from 'reactstrap';

interface IRamenList {
  list: Array<{
    id: string;
    name: string;
    rating: number;
    url: string;
    location: {
      address1: string;
      city: string;
      zip_code: string;
      state: string;
    }
    distance: number;
  }>
}

const Zip: React.SFC<IRamenList> = (props) => {
  const listItems = props.list.map((list) => {
    return (
      <tr key={list.id} style={{textAlign: 'left'}}>
        <td><a href={list.url} target={'_blank'}> {list.name}</a></td>
        <td>{list.location.address1} {list.location.city}, {list.location.state} {list.location.zip_code}</td>
      </tr>
    )
  });

  return (
    <div className='col-lg-8 offset-lg-2'>
      <Table className='table-bordered'>
        <tbody>
          {listItems}
        </tbody>
      </Table>
    </div>
  );
};

export default Zip;