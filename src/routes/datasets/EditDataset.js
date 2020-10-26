import React, { useEffect } from 'react';
import { Heading, Box } from '@chakra-ui/core';
import { useParams } from 'react-router-dom';
import { useFirestore, useFirestoreDocDataOnce, useUser } from 'reactfire';

import Page from '../../components/Page';
import GridContainer from '../../components/GridContainer';
import ComposeDataset from '../../components/forms/datasets/ComposeDataset';
import { useNavigate } from 'react-router-dom';

export default (props) => {
  const { uid } = useParams();
  const navigate = useNavigate();
  const user = useUser();
  const db = useFirestore();

  const datasetRef = db.collection('datasets').doc(uid);
  const datasetData = useFirestoreDocDataOnce(datasetRef);

  useEffect(() => {
    if (datasetData.author !== user.uid) navigate('/');
  }, [datasetData.author, user.uid, navigate]);

  return (
    <Page title="Edit Dataset">
      <GridContainer isInitial>
        <Box width={{ lg: '50%' }}>
          <Heading as="h2" size="xl" mb={4}>
            Edit Dataset
          </Heading>
          <ComposeDataset
            data={datasetData}
            uid={uid}
            callback={() => navigate('/datasets/me')}
          />
        </Box>
      </GridContainer>
    </Page>
  );
};
