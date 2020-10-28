import React, { useEffect, useState } from 'react';
import {
  Flex,
  Button,
  Box,
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  FormControl,
  FormLabel,
  Select,
  Text,
} from '@chakra-ui/core';
import { UpDownIcon } from '@chakra-ui/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDebounce } from 'use-debounce';

import Page from '../components/Page';
import GridContainer from '../components/GridContainer';

export const SearchBox = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [mode, setMode] = useState(searchParams.get('mode') || 'datasets');
  const [tags, setTags] = useState(searchParams.get('tags') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'most-upvotes');

  useEffect(() => {
    const e = encodeURIComponent;

    navigate(
      `/search?search=${e(search)}&mode=${e(mode)}&tags=${e(tags)}&sort=${e(
        sort
      )}`
    );
  }, [search, mode, tags, sort, navigate]);

  return (
    <Flex align="center">
      <Input
        type="text"
        bg="white"
        placeholder="Search for anything..."
        mr={2}
        width="320px"
        defaultValue={search}
        onChange={({ target }) => setSearch(target.value)}
      />
      <Popover>
        <PopoverTrigger>
          <Button variant="ghost">
            <UpDownIcon mr={2} />
            <Text>Filter & Sort</Text>
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>Filter & Sort</PopoverHeader>
          <PopoverBody>
            <FormControl id="mode" mb={2}>
              <FormLabel>Mode</FormLabel>
              <Select
                bg="white"
                onChange={({ target }) => setMode(target.value)}
                defaultValue={mode}
              >
                <option value="datasets">Datasets</option>
                <option value="models">Models</option>
              </Select>
            </FormControl>
            <FormControl id="tags" mb={2}>
              <FormLabel>Tags</FormLabel>
              <Input
                type="text"
                bg="white"
                placeholder="Search for (comma-separated) tags..."
                defaultValue={tags}
                onChange={({ target }) => setTags(target.value)}
              />
            </FormControl>
            <FormControl id="sort" mb={2}>
              <FormLabel>Sort</FormLabel>
              <Select
                bg="white"
                onChange={({ target }) => setSort(target.value)}
                defaultValue={sort}
              >
                <option value="most-upvotes">Most Upvotes</option>
                <option value="least-upvotes">Least Upvotes</option>
              </Select>
            </FormControl>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Flex>
  );
};

export default () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search');
  const mode = searchParams.get('mode');
  const tags = searchParams.get('tags');
  const sort = searchParams.get('sort');

  const [results, setResults] = useState([]);

  // Only debounce search and tags because the other inputs are select and less likely to constant updates
  const [debouncedSearch] = useDebounce(search, 500);
  const [debouncedTags] = useDebounce(tags, 500);

  useEffect(() => {
    console.log('DO SEARCH', debouncedSearch, mode, debouncedTags, sort);
  }, [debouncedSearch, mode, debouncedTags, sort]);

  return (
    <Page title="Search Results">
      <GridContainer isInitial>
        <Box>
          <p>{search}</p>
          <p>{mode}</p>
          <p>{tags}</p>
          <p>{sort}</p>
          {console.log(results)}
        </Box>
      </GridContainer>
    </Page>
  );
};
