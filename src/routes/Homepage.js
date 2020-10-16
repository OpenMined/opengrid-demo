import React from 'react';
import { useFirestoreDocData, useFirestore, SuspenseWithPerf } from 'reactfire';
import Loading from '../components/Loading';

function Burrito() {
  const burritoRef = useFirestore().collection('tryreactfire').doc('burrito');
  const burrito = useFirestoreDocData(burritoRef);

  return <p>The burrito is {burrito.yummy ? 'good' : 'bad'}</p>;
}

export default () => (
  <div>
    <p>Homepage</p>
    <SuspenseWithPerf fallback={<Loading />} traceId={'load-burrito-status'}>
      <Burrito />
    </SuspenseWithPerf>
  </div>
);
