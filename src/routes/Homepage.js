import React, { useState } from 'react';
import {
  Flex,
  Heading,
  Text,
  Box,
  Input,
  Select,
  Button,
  Link,
} from '@chakra-ui/core';
import { useNavigate } from 'react-router-dom';

import GridContainer from '../components/GridContainer';
import waveform from '../assets/waveform.png';

export default () => {
  const [search, setSearch] = useState('');
  const [mode, setMode] = useState('datasets');
  const navigate = useNavigate();

  const doSearch = () =>
    navigate(
      `/search?search=${encodeURIComponent(search)}&mode=${encodeURIComponent(
        mode
      )}`
    );

  return (
    <Box
      position="relative"
      pb={[32, null, null, 40, 48]}
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        backgroundImage: `url(${waveform})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '0% 100%',
        backgroundSize: 'contain',
      }}
    >
      <GridContainer pt="72px">
        <Flex
          mt={[5, null, 8, 12, 16]}
          direction="column"
          align="center"
          textAlign="center"
        >
          <Heading as="h1" size="hero" mb={[4, 6, 10]}>
            No data? No problem.
          </Heading>
          <Text
            color="gray.700"
            fontSize="xl"
            width={['90%', null, null, '70%', '50%']}
            mb={[4, 6, 16]}
          >
            Welcome to the world's first registry exclusively built for private
            datasets and models. Search for anything you would like and schedule
            a{' '}
            <Link
              as="a"
              color="blue.500"
              href="https://www.youtube.com/watch?v=DppXfA6C8L8"
              target="_blank"
            >
              "Duet session"
            </Link>{' '}
            with the data owner.
          </Text>
          <Box width={['100%', null, null, '60%']}>
            <Flex
              align="center"
              direction={{ base: 'column', md: 'row' }}
              mb={8}
            >
              <Input
                type="text"
                size="lg"
                bg="white"
                placeholder="Search for anything..."
                flex={{ md: '0 0 75%' }}
                mr={{ base: 0, md: 4 }}
                mb={{ base: 4, md: 0 }}
                defaultValue={search}
                onChange={({ target }) => setSearch(target.value)}
              />
              <Select
                size="lg"
                bg="white"
                onChange={({ target }) => setMode(target.value)}
                defaultValue={mode}
              >
                <option value="datasets">Datasets</option>
                <option value="models">Models</option>
              </Select>
            </Flex>
            <Button colorScheme="blue" onClick={doSearch} size="lg">
              Search {mode === 'datasets' ? 'Datasets' : 'Models'}
            </Button>
          </Box>
        </Flex>
      </GridContainer>
    </Box>
  );
};
