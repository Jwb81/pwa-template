import { apiUrl } from './apiConfig';
import { USER_ID_KEY, API_TOKEN_KEY } from '../constants/storage';

const baseRoute = `${apiUrl}/Account`;

export const login = async (username, password, rememberMe = false) => {
  const url = `${baseRoute}/AppLogin`;

  let formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);
  formData.append('rememberMe', rememberMe);

  var headers = new Headers();

  var requestOptions = {
    method: 'POST',
    headers,
    body: formData,
  };

  const response = await fetch(url, requestOptions);

  return response.ok ? await response.json() : Promise.reject(response);
};

export const verifyToken = async () => {
  const url = `${baseRoute}/AppTokenVerify`;

  // get details from local storage
  const userId = localStorage.getItem(USER_ID_KEY);
  const apiToken = localStorage.getItem(API_TOKEN_KEY);

  let formData = new FormData();
  formData.append('userId', userId);
  formData.append('token', apiToken);

  var headers = new Headers();

  var requestOptions = {
    method: 'POST',
    headers,
    body: formData,
  };

  const response = await fetch(url, requestOptions);

  return response.ok ? await response.json() : Promise.reject(response);
};
