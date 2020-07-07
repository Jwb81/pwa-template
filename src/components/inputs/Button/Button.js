import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

export const Button = ({ classes, children, disabled, onChange, bgClasses, textClasses, style, ...rest }) => {
  const computedBgClasses = disabled ? 'bg-gray-500 cursor-default' : bgClasses;

  return (
    <button
      className={cx(
        'font-bold py-2 px-4 rounded focus:outline-none',
        computedBgClasses,
        textClasses,
        classes,
      )}
      style={style}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  bgClasses: PropTypes.string,
  textClasses: PropTypes.string,
  disabled: PropTypes.bool,
};

Button.defaultProps = {
  bgClasses: 'bg-blue-500 hover:bg-blue-700',
  textClasses: 'text-white',
  disabled: false,
};
