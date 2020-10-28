import React from 'react';
import { Box, Flex, Heading, Text, Avatar, Link } from '@chakra-ui/core';
import { TimeIcon } from '@chakra-ui/icons';
import { Link as RRDLink } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const TRUNCATE = 120;

const filterDescription = (d) => d.split('<br />').join(' ');

export default ({
  mode,
  name,
  description,
  author,
  created_at,
  updated_at,
  upvotes,
  tags,
  uid,
  ...props
}) => {
  const PAGE_MODE =
    mode || window.location.pathname.includes('datasets')
      ? 'datasets'
      : 'models';

  description = filterDescription(description);

  return (
    <Box bg="white" shadow="md" borderRadius="md" p={6} {...props}>
      <RRDLink to={`/${PAGE_MODE}/${uid}`}>
        <Heading as="h3" size="md" mb={2}>
          {name}
        </Heading>
      </RRDLink>
      <Text color="gray.500" width={['100%', null, null, '50%']} mb={4}>
        {description.length > TRUNCATE
          ? `${description.slice(0, TRUNCATE)}...`
          : description}
      </Text>
      <Flex justify="space-between" align="center">
        <Flex>
          {typeof author !== 'string' && (
            <Flex align="center" mr={6}>
              <Avatar src={author.photoURL} size="xs" mr={2} />
              <Text fontWeight="bold">
                {author.first_name} {author.last_name}
              </Text>
            </Flex>
          )}
          <Flex align="center" mr={6}>
            <TimeIcon mr={2} color="gray.500" />
            <Text color="gray.700">
              Created {dayjs.unix(created_at.seconds).fromNow()}
            </Text>
          </Flex>
          <Flex align="center">
            <Text color="yellow.500" mr={2}>
              ★
            </Text>
            <Text color="gray.700">
              {upvotes.length} upvote{upvotes.length !== 1 && 's'}
            </Text>
          </Flex>
        </Flex>
        <Box>
          {tags.map((tag, i) => (
            <Text
              key={tag}
              fontSize="sm"
              fontWeight="bold"
              color="gray.500"
              display="inline"
            >
              <Link as={RRDLink} to={`/search?search=${tag}&mode=${PAGE_MODE}`}>
                #{tag}
              </Link>
              {i + 1 < tags.length && <Text as="span">, </Text>}
            </Text>
          ))}
        </Box>
      </Flex>
    </Box>
  );
};
