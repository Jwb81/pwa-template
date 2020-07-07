import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiX } from 'react-icons/fi';
import cx from 'classnames';
import { Button } from 'components/inputs';

const modalRoot = document.getElementById('modal');

const DefaultFooter = props => (
  <React.Fragment>
    <div />
    <div className="">
      <Button bgClasses="bg-red-500 hover:bg-red-700" classes="mr-4">
        Cancel
      </Button>
      <Button bgClasses="bg-green-500 hover:bg-green-700" classes="mr-4">
        Save
      </Button>
      <Button bgClasses="border-solid border-2 border-green-400" textClasses="text-blue-500" classes="outline-none">
        Test
      </Button>
    </div>
  </React.Fragment>
);

const Modal = ({
  open,
  onClose,
  children,
  footer = <DefaultFooter />,
  header,
  showDividers = false,
  backgroundClass = 'bg-gray-100',
}) => {
  // const element = document.createElement('div');

  // useEffect(() => {
  //   modalRoot.appendChild(element);

  //   return () => {
  //     modalRoot.removeChild(element);
  //   };
  //   //
  // }, []);

  if (!open) return null;

  const modalContainer = (
    <div
      className="fixed w-full h-full pin overflow-auto bg-gray-900 bg-opacity-50 flex"
      style={{ zIndex: 2000, touchAction: 'manipulation' }}
      onClick={onClose}
    >
      <div
        class={cx(
          'relative m-auto flex-col flex w-11/12 max-w-screen-lg rounded',
          backgroundClass,
          showDividers && 'divide-y',
        )}
        onClick={evt => evt.stopPropagation()}
      >
        {/* HEADER */}
        {!!header && (
          <div
            class={cx(
              'flex-row flex items-center p-4 pb-2 text-xl font-bold',
              !!header ? 'justify-between' : 'justify-end',
            )}
            onClick={evt => evt.stopPropagation()}
          >
            {header}

            {/* <span className="absolute top-0 right-0 p-3 cursor-pointer" style={{ top: 5, right: 5 }}> */}
            {/* <span className="p-3 cursor-pointer" style={{ justifySelf: 'end' }}>
            <FiX onClick={onClose} />
          </span> */}
          </div>
        )}

        <div className="px-4 py-2">{children}</div>

        {/* FOOTER */}
        <div class="flex flex-row justify-between items-center p-4 pt-2" onClick={evt => evt.stopPropagation()}>
          {footer}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContainer, modalRoot);
};

export default Modal;
