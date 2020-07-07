import React, { useContext, useEffect, useState, useRef } from "react";
import classes from "./Snackbar.module.css";
import cx from "classnames";
import { AppContext, setSnackbar } from "../../context/AppContext";
import { FiX } from "react-icons/fi";

const SNACKBAR_VISIBLE_TIME = 2900; // the amount of time (in ms) that the animation takes in css

const variants = {
  info: {
    container: "bg-blue-700",
    closeButton: "bg-blue-600 hover:bg-blue-500"
  },
  error: {
    container: "bg-red-700",
    closeButton: "bg-red-600 hover:bg-red-500"
  },
  success: {
    container: "bg-green-600",
    closeButton: "bg-green-500 hover:bg-green-400"
  },
  default: {
    container: "bg-gray-800",
    closeButton: "bg-gray-700 hover:bg-gray-600"
  }
};

const Snackbar = props => {
  const timeoutRef = useRef(null);

  const {
    state: {
      snackbar: { open, message, variant }
    },
    dispatch
  } = useContext(AppContext);

  const removeExistingTimeout = () => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const closeSnackbar = () => {
    removeExistingTimeout();
    dispatch(setSnackbar());
  };

  const createTimeout = () => {
    removeExistingTimeout();

    timeoutRef.current = setTimeout(() => {
      // SET A TIMEOUT
      // timeoutRef.current = null; // RESET REF TO NULL WHEN IT RUNS
      removeExistingTimeout();
      closeSnackbar();
    }, SNACKBAR_VISIBLE_TIME);
  };

  useEffect(() => {
    return () => {
      removeExistingTimeout();
    };
  }, []);

  useEffect(() => {
    if (open) {
      createTimeout();
    }
  }, [open]);

  const selectedVariants = variants[variant] || variants.default;

  return (
    <div
      className={cx(
        "flex flex-row justify-between items-center shadow-2xl",
        selectedVariants.container,
        classes.snackbar,
        open && classes.show
      )}
    >
      <span>{message}</span>
      <span
        className={cx(
          "ml-6 p-1 rounded-full cursor-pointer",
          selectedVariants.closeButton
        )}
      >
        <FiX onClick={closeSnackbar} />
      </span>
    </div>
  );
};

export default Snackbar;
