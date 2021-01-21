import { API_TOKEN_KEY } from '../constants/storage';

const { REACT_APP_ENVIRONMENT, REACT_APP_BACKEND } = process.env;

export const apiUrl = (() => {
  const localBackendUrl = 'http://localhost:3000';

  if (REACT_APP_BACKEND === 'local') {
    return localBackendUrl;
  }

  switch (REACT_APP_ENVIRONMENT) {
    case 'development':
      return 'http://dev.hosted.backend';
    case 'staging':
      return 'http://staging.hosted.backend';
    case 'production':
      return 'http://prod.hosted.backend';
    default:
      return localBackendUrl;
  }
})();

export const getApiToken = () => localStorage.getItem(API_TOKEN_KEY);

export const getHeaders = (optionalHeaders = {}) => {
  const token = getApiToken();
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
