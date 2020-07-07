import React from 'react';
import classes from './Checkbox.module.css';
import cx from 'classnames';

export const Checkbox = ({ classes, type, field, label, error, placeholder, required, options, value, onChange }) => (
  <div className={cx('w-full md:w-1/2 px-3 mb-0', classes)}>
    <div>
      <label
        className={cx(
          'block uppercase tracking-wide text-xs font-bold mb-2',
          error ? 'text-red-500' : 'text-gray-700',
          classes,
        )}
        htmlFor={field}
      >
        {!!options && label} {error && `${!!options ? ':' : ''} ${error}`}
      </label>
      <div className="mt-2">
        {!!options ? (
          options.map(({ value: optValue, label }, optIdx) => (
            <label className={cx('inline-flex items-center', { 'ml-6': !!optIdx })} key={optIdx}>
              <input
                type="checkbox"
                className="form-checkbox"
                name={`${field}-${optValue}`}
                checked={value.includes(optValue)}
                value={optValue} // used in onChange evt
                onChange={onChange}
                required={required}
                multiple
              />
              <span className="ml-2">{label}</span>
            </label>
          ))
        ) : (
          <label className={cx('inline-flex items-center')}>
            <input
              type="checkbox"
              className="form-checkbox"
              name={`${field}`}
              checked={value}
              value={value}
              onChange={onChange}
              required={required}
              multiple
            />
            <span className="ml-2">{label}</span>
          </label>
        )}
      </div>
    </div>
  </div>
);
