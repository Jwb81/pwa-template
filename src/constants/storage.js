import { name } from '../../package.json';

const keyBase = name.toUpperCase().replace(/-/g, '_')

export const API_TOKEN_KEY = `${keyBase}API_TOKEN`;
export const USERNAME_KEY = `${keyBase}USERNAME`;
export const USER_ID_KEY = `${keyBase}USER_ID`;
export const REMEMBER_ME_KEY = `${keyBase}REMEMBER_ME`;
