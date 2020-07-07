import { FiCamera, FiHome, FiMap } from 'react-icons/fi';

const routes = [
  {
    path: '/',
    exact: true,
    private: true,
    pageTitle: 'Dashboard',
    drawerLabel: 'Dashboard',
    icon: FiHome,
  },
  {
    path: '/map',
    exact: true,
    private: true,
    pageTitle: 'Map Screen',
    drawerLabel: 'Map',
    icon: FiMap,
  },
  {
    path: '/login',
    exact: true,
    pageTitle: 'Login',
    hidden: true,
    hideDrawer: true,
  },
  {
    path: '/delivery-form',
    exact: true,
    private: true,
    pageTitle: 'Confirm Delivery',
    drawerLabel: 'Confirm A Delivery',
    icon: FiCamera,
  },

  // {
  //   path: '/spinners',
  //   exact: true,
  //   private: true,
  //   pageTitle: 'Spinner Examples',
  //   drawerLabel: 'Spinners',
  //   icon: FiCamera,
  // },
];

export default routes;
