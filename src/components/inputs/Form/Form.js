import React from 'react';
import cx from 'classnames';

export const Form = ({ classes, children, ...rest }) => {
  return (
    <form className={cx('w-11/12 md:w-1/2 bg-white shadow-md rounded px-8 pt-6 pb-8 my-4', classes)} {...rest}>
      {children}
    </form>
  );
};
