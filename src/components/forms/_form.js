import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Select,
  Textarea,
  Input,
  Button,
} from '@chakra-ui/core';

import { capitalize } from '../../helpers';

export default ({ settings = {}, schema, onSubmit, fields }) => {
  const {
    register,
    handleSubmit,
    errors,
    formState: { isDirty, isValid, isSubmitting },
  } = useForm({ ...settings, mode: 'onBlur', resolver: yupResolver(schema) });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fields.map(({ label, options, ...input }) => {
        const hasErrors = errors.hasOwnProperty(input.name);

        let ComposedInput;

        if (input.type === 'select') {
          ComposedInput = (
            <Select {...input} ref={register}>
              {options.map((option) => (
                <option {...option} />
              ))}
            </Select>
          );
        } else if (input.type === 'textarea') {
          ComposedInput = <Textarea {...input} ref={register} />;
        } else {
          ComposedInput = <Input {...input} ref={register} />;
        }

        return (
          <FormControl key={input.name} isInvalid={hasErrors}>
            {label && <FormLabel htmlFor={input.name}>{label}</FormLabel>}
            {ComposedInput}
            {hasErrors && (
              <FormErrorMessage>
                {capitalize(errors[input.name].message)}
              </FormErrorMessage>
            )}
          </FormControl>
        );
      })}
      <Button
        mt={4}
        disabled={!isDirty || (isDirty && !isValid)}
        isLoading={isSubmitting}
        type="submit"
      >
        Submit
      </Button>
    </form>
  );
};
