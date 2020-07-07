import React from 'react';
import classes from './Radio.module.css';
import cx from 'classnames';

export const Radio = ({ classes, type, field, label, error, placeholder, required, options, value, onChange }) => (
  <div className={cx('w-full md:w-1/2 px-3 mb-0', classes)}>
    <div>
      <label
        className={cx('block uppercase tracking-wide text-xs font-bold mb-2', error ? 'text-red-500' : 'text-gray-700')}
        htmlFor={value}
      >
        {label} {error && `: ${error}`}
      </label>

      {/* add negative margin on the container and then add the same (positive) margin, on each item */}
      <div className="mt-2 -mx-3 flex flex-wrap flex-col lg:flex-row justify-start">
        {options.map(({ value: optValue, label }, optIdx) => (
          <label className={cx('inline-flex items-center mx-3')} key={optIdx}>
            <input
              type="radio"
              className="form-radio"
              name={field}
              checked={value === optValue}
              value={optValue} // used in onChange evt
              onChange={onChange}
              required={required}
            />
            <span className="ml-2">{label}</span>
          </label>
        ))}
      </div>
    </div>
  </div>
);
