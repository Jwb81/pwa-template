import { SET_SNACKBAR, SET_USER, LOGOUT_USER, SET_IS_AUTHENTICATED, SET_DRAWER } from './constants';

export const reducer = (state, action) => {
  switch (action.type) {
    case SET_SNACKBAR:
      return {
        ...state,
        snackbar: action.snackbar,
      };
    case SET_USER:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.user,
        },
      };
    case LOGOUT_USER:
      return {
        ...state,
        user: action.user,
      };
    case SET_IS_AUTHENTICATED:
      return {
        ...state,
        user: {
          ...state.user,
          isAuthenticated: action.isAuthenticated,
        },
      };
    case SET_DRAWER:
      return {
        ...state,
        drawer: action.drawer,
      };
    default:
      return state;
  }
};

export default reducer;
