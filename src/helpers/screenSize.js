const minSmScreenWidth = 640;
const minMdScreenWidth = 768;
const minLgScreenWidth = 1024;
const minXlScreenWidth = 1280;

export const isXsScreen = () => {
  return window.innerWidth < minSmScreenWidth;
};
export const isSmScreen = () => {
  return window.innerWidth < minMdScreenWidth;
};
export const isMdScreen = () => {
  return window.innerWidth < minLgScreenWidth;
};
export const isLgScreen = () => {
  return window.innerWidth < minXlScreenWidth;
};
export const isXlScreen = () => {
  return window.innerWidth >= minXlScreenWidth;
};
