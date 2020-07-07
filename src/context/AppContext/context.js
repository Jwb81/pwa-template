import React from 'react';
import PropTypes from 'prop-types';
import reducer from './reducer';
import { defaultSnackbarState, defaultDrawerState } from './defaults';

const initialState = {
  snackbar: defaultSnackbarState,
  user: null,
  drawer: defaultDrawerState,

  // for testing
  // user: {
  //   username: "mdoraty"
  //   isAuthenticated: true
  // },
};

const AppContext = React.createContext(initialState);

const AppContextProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

AppContextProvider.propTypes = {
  children: PropTypes.any,
};

export { AppContext, AppContextProvider };
