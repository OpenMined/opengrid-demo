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
  Heading,
} from '@chakra-ui/core';
import { SettingsIcon } from '@chakra-ui/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import algoliasearch from 'algoliasearch';

import Data from '../components/Data';
import Page from '../components/Page';
import GridContainer from '../components/GridContainer';

export const SearchBox = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [mode, setMode] = useState(searchParams.get('mode') || 'datasets');
  const [tags, setTags] = useState(searchParams.get('tags') || '');

  useEffect(() => {
    const e = encodeURIComponent;

    navigate(`/search?search=${e(search)}&mode=${e(mode)}&tags=${e(tags)}`);
  }, [search, mode, tags, navigate]);

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
            <SettingsIcon mr={2} />
            <Text>Filters</Text>
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>Filters</PopoverHeader>
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
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Flex>
  );
};

const algolia = algoliasearch(
  process.env.REACT_APP_ALGOLIA_APP_ID,
  process.env.REACT_APP_ALGOLIA_SEARCH_KEY
);

export default () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search');
  const mode = searchParams.get('mode');
  const tags = searchParams.get('tags');

  const [results, setResults] = useState([]);

  // Only debounce search and tags because the other inputs are select and less likely to constant updates
  const [debouncedSearch] = useDebounce(search, 500);
  const [debouncedTags] = useDebounce(tags, 500);

  useEffect(() => {
    if (debouncedSearch) {
      const arrayTags =
        debouncedTags && debouncedTags !== ''
          ? debouncedTags
              .replace(/\s*,\s*/g, ',')
              .split(' ')
              .join('-')
              .split(',')
          : [];

      const index = algolia.initIndex(mode);
      const options = { hitsPerPage: 20 };

      if (arrayTags.length > 0) options.tagFilters = [arrayTags];

      index.search(debouncedSearch, options).then(({ hits }) => {
        hits = hits.map((h) => {
          const uid = h.objectID;
          const created_at = {
            seconds: h.created_at._seconds,
            nanoseconds: h.created_at._nanoseconds,
          };
          const updated_at = {
            seconds: h.created_at._seconds,
            nanoseconds: h.created_at._nanoseconds,
          };

          delete h.objectID;
          delete h._highlightResult;
          delete h._tags;

          return {
            ...h,
            uid,
            created_at,
            updated_at,
          };
        });

        setResults(hits);
      });
    }
  }, [debouncedSearch, mode, debouncedTags]);

  return (
    <Page title="Search Results">
      <GridContainer isInitial>
        <Box>
          {results.length > 0 &&
            results.map((data, i) => (
              <Data {...data} mode={mode} key={i} mb={4} />
            ))}
          {results.length === 0 && (
            <Heading
              as="span"
              size="md"
              color="gray.700"
              display="block"
              mb={4}
            >
              There are no {mode} for this search query.
            </Heading>
          )}
        </Box>
      </GridContainer>
    </Page>
  );
};
