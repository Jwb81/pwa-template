import { API_TOKEN_KEY } from '../constants/storage';

export const apiUrl = (function(env) {
  switch (env) {
    case 'production':
      return 'http://localhost:3001';
    default:
      return 'http://localhost:3001';
  }
})(process.env.NODE_ENV);

export const getToken = () => localStorage.getItem(API_TOKEN_KEY);

export const getHeaders = (optionalHeaders = {}) => {
  const token = getToken();
  let defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  let headers = new Headers();
  const tempHeaders = Object.assign({}, defaultHeaders, optionalHeaders);

  Object.keys(tempHeaders).forEach(headerKey => {
    headers.append(headerKey, tempHeaders[headerKey]);
  });

  return headers;
};
