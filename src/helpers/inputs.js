import React, { Component } from 'react';
import cx from 'classnames';
import { Select, Text, Radio, Checkbox, TextArea } from '../components/inputs';

export const generateInitialFormValueState = inputList => {
  const initState = inputList.flat().reduce((acc, cur) => {
    // const initVal = cur.options ? cur.options[0].value : '';
    const initVal = cur.initValue || '';

    acc[cur.field] = initVal;
    return acc;
  }, {});

  return initState;
};

export const renderInput = (input, idx, formValues, onChange, errors = {}) => {
  const { field, type, options, label, classes, component } = input;
  const { initValue, ...sanitized } = input;

  switch (input.type) {
    case 'select':
      return (
        <Select key={idx} {...input} value={formValues[field]} onChange={onChange(field, type)} error={errors[field]} />
      );
    case 'textarea':
      return (
        <TextArea
          key={idx}
          {...sanitized}
          value={formValues[input.field]}
          onChange={onChange(field, type)}
          error={errors[field]}
        />
      );
    case 'text':
    case 'number':
    case 'email':
    case 'password':
      return (
        <Text
          key={idx}
          {...sanitized}
          value={formValues[input.field]}
          onChange={onChange(field, type)}
          error={errors[field]}
        />
      );
    case 'radio':
      return (
        <Radio key={idx} {...sanitized} value={formValues[field]} onChange={onChange(field, type)} error={errors[field]} />
      );
    case 'checkbox':
      const handleCheckboxChange = evt => {
        // console.log(evt);
        const { name, value } = evt.currentTarget;

        const inputPartialName = name.split('-')[0];

        if (!options) {
          const curValue = value === 'true' ? true : false;
          // console.log(value, value == "true", !curValue);
          return onChange(field, type)(evt, !curValue);
        }

        const selectedValues = Array.from(document.querySelectorAll(`input[name^=${inputPartialName}]`))
          .filter(i => i.checked)
          .map(i => i.value);

        onChange(field, type)(evt, selectedValues);
      };

      const formValue = formValues[field];

      return (
        <Checkbox
          key={idx}
          {...sanitized}
          value={formValue}
          onChange={handleCheckboxChange}
          error={errors[field]}
          // onChange={onChange(field, type)}
        />
      );

    case 'h1':
      return <div className={cx('font-bold text-6xl px-3', classes)}>{label}</div>;
    case 'h2':
      return <div className={cx('font-bold text-5xl px-3', classes)}>{label}</div>;
    case 'h3':
      return <div className={cx('font-bold text-4xl px-3', classes)}>{label}</div>;
    case 'h4':
      return <div className={cx('font-bold text-3xl px-3', classes)}>{label}</div>;
    case 'h5':
      return <div className={cx('font-bold text-2xl px-3', classes)}>{label}</div>;
    case 'h6':
      return <div className={cx('font-bold text-1xl px-3', classes)}>{label}</div>;

    case 'custom':
      const customProps = {
        ...sanitized,
        value: formValues[field],
        onChange: onChange(field, type),
      };

      return typeof component === 'object'
        ? React.cloneElement(component, customProps)
        : React.createElement(component, customProps);
    default:
      return null;
  }
};

// validation functions
export const v = {
  required: (message = 'Required') => value => (value ? undefined : message),
  maxLength: (max, message = 'Too long') => value => (value && value.length > max ? message : undefined),
  minLength: (min, message = 'Too short') => value => (value && value.length < min ? message : undefined),

  number: (message = 'Must be a number') => value => (value && isNaN(Number(value)) ? message : undefined),
  minValue: (min, message = 'Too small') => value => (value && value < min ? message : undefined),

  hasLength: (length, message = 'Length is incorrect') => value =>
    value && value.length === length ? undefined : message,

  checkRecordType: (message = 'Required') => value =>
    value === 'Active' || value === 'Inactive' ? undefined : message,
};

/**
 * @func checkInputValidity
 * @desc check the input against its validity functions
 */
export const checkInputValidity = (inputObj, inputData, parentDataObj = null) => {
  // reset errors
  inputObj.error = false;
  inputObj.errorMessage = null;

  let errorMessage = undefined;

  if (inputObj.validate && inputObj.validate.length) {
    // run through the validation functions for this input
    errorMessage = inputObj.validate.reduce((acc, func) => (acc ? acc : func(inputData, parentDataObj)), undefined);
  }

  return errorMessage; // an error string or null
};
