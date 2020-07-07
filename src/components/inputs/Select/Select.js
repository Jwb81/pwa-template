import React from 'react';
import classes from './Select.module.css';
import cx from 'classnames';
import PropTypes from 'prop-types';

export const Select = ({
  classes,
  sizingClasses,
  field,
  label,
  error,
  placeholder,
  required,
  options,
  value,
  onChange,
}) => (
  <div className={cx('px-3 mb-3', sizingClasses, classes)}>
    <label
      className={cx('block uppercase tracking-wide text-xs font-bold mb-2', error ? 'text-red-500' : 'text-gray-700')}
      htmlFor={field}
    >
      {label} {error && `${!!label ? ':' : ''} ${error}`}
    </label>
    <div className="relative">
      <select
        className={cx(
          'block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500',
          error && 'border-red-500',
        )}
        id={field}
        value={value}
        onChange={onChange}
        required={required}
      >
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  </div>
);

Select.propTypes = {
  sizingClasses: PropTypes.string,
};

Select.defaultProps = {
  sizingClasses: 'w-full',
};
