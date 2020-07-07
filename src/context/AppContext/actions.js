import { SET_SNACKBAR, SET_USER, LOGOUT_USER, SET_IS_AUTHENTICATED, SET_DRAWER } from './constants';
import { defaultSnackbarState, defaultDrawerState } from './defaults';
import { USER_ID_KEY, API_TOKEN_KEY, USERNAME_KEY } from '../../constants/storage';

export const setSnackbar = (snackbar = {}) => ({
  type: SET_SNACKBAR,
  snackbar: {
    ...defaultSnackbarState,
    ...snackbar,
  },
});

export const setUser = (user) => {
  if (user) {
    localStorage.setItem(USER_ID_KEY, user.userId);
    localStorage.setItem(API_TOKEN_KEY, user.token);
  }

  return {
    type: SET_USER,
    user,
  };
};

export const logoutUser = () => {
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(API_TOKEN_KEY);

  return {
    type: LOGOUT_USER,
    user: null,
  };
};

export const setIsAuthenticated = (isAuthenticated) => ({
  type: SET_IS_AUTHENTICATED,
  isAuthenticated,
});

export const setDrawer = (drawer = {}) => ({
  type: SET_DRAWER,
  drawer: {
    ...defaultDrawerState,
    ...drawer,
  },
});
