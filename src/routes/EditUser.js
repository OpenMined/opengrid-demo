import React from 'react';
import { Heading, Flex, Avatar, Text, Box } from '@chakra-ui/core';
import { useUser } from 'reactfire';

import Page from '../components/Page';
import GridContainer from '../components/GridContainer';
import UpdatePassword from '../components/forms/UpdatePassword';
import UpdateUser from '../components/forms/UpdateUser';
import UploadProfilePhoto from '../components/forms/UploadProfilePhoto';

export default () => {
  const user = useUser();

  return (
    <Page title="Edit User">
      <GridContainer isInitial>
        <Box width={{ lg: '50%' }} mb={5}>
          <Heading as="h2" size="xl" mb={4}>
            Edit User
          </Heading>
          <UploadProfilePhoto
            placeholder={
              <Flex alignItems="center" cursor="pointer" mb={3}>
                <Avatar
                  src={user.photoURL}
                  name={user.displayName || user.email}
                  size="lg"
                />
                <Text ml={4} color="gray.700" fontWeight="medium">
                  Click to change profile photo
                </Text>
              </Flex>
            }
          />
        </Box>
        <Box width={{ lg: '50%' }} mb={5}>
          <Heading as="h4" size="md" mb={4}>
            Profile Information
          </Heading>
          <UpdateUser />
        </Box>
        <Box width={{ lg: '50%' }}>
          <Heading as="h3" size="lg" mb={4}>
            Change Password
          </Heading>
          <UpdatePassword />
        </Box>
      </GridContainer>
    </Page>
  );
};
