import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Flex,
  FormErrorMessage,
  FormLabel,
  FormControl,
  Select,
  Textarea,
  Input,
  Button,
  SimpleGrid,
} from '@chakra-ui/core';

import { capitalize } from '../../helpers';

export default ({
  settings = {},
  schema,
  onSubmit,
  fields,
  submit,
  nextToSubmit,
}) => {
  const {
    register,
    handleSubmit,
    errors,
    formState: { isDirty, isValid, isSubmitting },
  } = useForm({ ...settings, mode: 'onBlur', resolver: yupResolver(schema) });

  const SPACING = 4;

  const composeInput = ({ label, options, width = '100%', ...input }) => {
    const hasErrors = errors.hasOwnProperty(input.name);

    let ComposedInput;

    if (input.type === 'select') {
      ComposedInput = (
        <Select {...input} variant="filled" size="lg" ref={register}>
          {options.map((option) => (
            <option {...option} />
          ))}
        </Select>
      );
    } else if (input.type === 'textarea') {
      ComposedInput = (
        <Textarea {...input} variant="filled" size="lg" ref={register} />
      );
    } else {
      ComposedInput = (
        <Input {...input} variant="filled" size="lg" ref={register} />
      );
    }

    return (
      <FormControl key={input.name} isInvalid={hasErrors} mt={SPACING}>
        {label && (
          <FormLabel
            htmlFor={input.name}
            opacity={label === 'BLANK' ? 0 : 1}
            display={label === 'BLANK' ? ['none', 'block'] : 'block'}
          >
            {label}
          </FormLabel>
        )}
        {ComposedInput}
        {hasErrors && (
          <FormErrorMessage>
            {capitalize(errors[input.name].message.split('_').join(' '))}
          </FormErrorMessage>
        )}
      </FormControl>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field, i) => {
        if (Array.isArray(field)) {
          // Add labels to subfields that don't have it
          field = field.map((f) => ({
            ...f,
            label: f.label || 'BLANK',
          }));

          return (
            <SimpleGrid
              key={i}
              columns={[1, field.length]}
              spacing={[0, SPACING]}
            >
              {field.map((subfield) => composeInput(subfield))}
            </SimpleGrid>
          );
        } else {
          return composeInput(field);
        }
      })}
      <Flex align="center" wrap="wrap">
        {!submit && (
          <Button
            mt={SPACING}
            colorScheme="blue"
            disabled={!isDirty || (isDirty && !isValid)}
            isLoading={isSubmitting}
            type="submit"
          >
            Submit
          </Button>
        )}
        {submit &&
          React.cloneElement(submit, {
            disabled: !isDirty || (isDirty && !isValid),
            isLoading: isSubmitting,
            type: 'submit',
          })}
        {nextToSubmit}
      </Flex>
    </form>
  );
};
