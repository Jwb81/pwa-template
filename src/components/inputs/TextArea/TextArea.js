import React from 'react';
import cx from 'classnames';

export const TextArea = ({ classes, type, field, label, error, placeholder, required, value, onChange, ...rest }) => (
  <div className={cx('w-full px-3 mb-3', classes)}>
    <label
      className={cx('block uppercase tracking-wide text-xs font-bold mb-2', error ? 'text-red-500' : 'text-gray-700')}
      htmlFor={field}
    >
      {label} {error && `: ${error}`}
    </label>
    <textarea
      className={cx(
        'appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white',
        error && 'border-red-500',
      )}
      id={field}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      {...rest}
    />
    {/* <p className="text-red-500 text-xs italic">Please choose a password.</p> */}
  </div>
);
