import React from 'react';
import { Box, Flex, Link, Text } from '@chakra-ui/core';

export default () => (
  <Box width="full" bg="gray.50" p={4} mt={12}>
    <Flex direction={{ base: 'column', md: 'row' }} justify="space-between">
      <Text fontWeight="bold" color="gray.700">
        Built by{' '}
        <Link
          as="a"
          target="_blank"
          rel="noopener noreferrer"
          href="https://openmined.org"
        >
          OpenMined
        </Link>
      </Text>
      <Flex mt={{ base: 4, md: 0 }}>
        <Link
          as="a"
          color="blue.500"
          mr={4}
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/OpenMined/opengrid-demo/issues"
        >
          Report a problem
        </Link>
        <Link
          as="a"
          color="blue.500"
          target="_blank"
          rel="noopener noreferrer"
          href="https://slack.openmined.org"
        >
          Join our Slack Community!
        </Link>
      </Flex>
    </Flex>
  </Box>
);
