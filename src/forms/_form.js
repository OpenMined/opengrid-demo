import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export default ({ settings = {}, schema, onSubmit, fields }) => {
  const {
    register,
    handleSubmit,
    errors,
    formState: { isDirty, isValid },
  } = useForm({ ...settings, mode: 'onBlur', resolver: yupResolver(schema) });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fields.map((input) => {
        let ComposedInput;

        if (input.type === 'select') {
          ComposedInput = (
            <select {...input} ref={register}>
              {input.options.map((option) => (
                <option {...option} />
              ))}
            </select>
          );
        } else if (input.type === 'textarea') {
          ComposedInput = <textarea {...input} ref={register} />;
        } else {
          ComposedInput = <input {...input} ref={register} />;
        }

        return (
          <div key={input.name}>
            {ComposedInput}
            <span>{errors[input.name]?.message}</span>
          </div>
        );
      })}
      <input type="submit" disabled={!isDirty || (isDirty && !isValid)} />
    </form>
  );
};
