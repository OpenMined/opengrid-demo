import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Flex,
  FormErrorMessage,
  FormLabel,
  FormControl,
  Select,
  Textarea,
  Input,
  Button,
  SimpleGrid,
  Text,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/core';

import { capitalize } from '../../helpers';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';

const createInput = ({ options, ...input }, register, control) => {
  if (input.type === 'select') {
    return (
      <Select {...input} variant="filled" size="lg" ref={register}>
        {options.map((option) => (
          <option {...option} />
        ))}
      </Select>
    );
  } else if (input.type === 'textarea') {
    return <Textarea {...input} variant="filled" size="lg" ref={register} />;
  } else if (input.type === 'array') {
    return <FieldArray {...input} control={control} register={register} />;
  } else {
    return <Input {...input} variant="filled" size="lg" ref={register} />;
  }
};

const FieldArray = ({ name, max, fields, control, register, ...props }) => {
  const fieldArray = useFieldArray({
    control,
    name,
  });

  const [canAppend, setCanAppend] = useState(true);

  useEffect(() => {
    if (fieldArray.fields.length >= max) setCanAppend(false);
    else setCanAppend(true);
  }, [fieldArray.fields, max]);

  return (
    <>
      {fieldArray.fields.map((item, index) => (
        <Box key={item.id}>
          {fields.map((input) => {
            const inputName = `${name}[${index}].${input.name}`;

            return (
              <InputGroup key={inputName} size="lg" mb={2}>
                {createInput({ ...input, name: inputName }, register, control)}
                <InputRightElement cursor="pointer">
                  <DeleteIcon
                    color="red.500"
                    onClick={() => fieldArray.remove(index)}
                  />
                </InputRightElement>
              </InputGroup>
            );
          })}
        </Box>
      ))}
      <Button
        onClick={fieldArray.append}
        disabled={!canAppend}
        colorScheme="blue"
        mt={2}
      >
        <AddIcon mr={2} />
        <Text>Add</Text>
      </Button>
    </>
  );
};

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
    control,
    handleSubmit,
    errors,
    formState: { isDirty, isValid, isSubmitting },
  } = useForm({ ...settings, mode: 'onBlur', resolver: yupResolver(schema) });

  const SPACING = 4;

  const composeInput = ({ label, ...input }) => {
    const hasErrors = errors.hasOwnProperty(input.name);

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
        {createInput(input, register, control)}
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
