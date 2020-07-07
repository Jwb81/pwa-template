/*eslint-disable*/
import React, { useContext } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { NavLink, withRouter } from 'react-router-dom';
import classes from './Drawer.module.css';
import { AppContext, setDrawer } from 'context/AppContext';
import routes from 'constants/routes';
import reactIcon from 'assets/images/logo512.png';

const routeIsActive = routeName => {
  return window.location.pathname === routeName ? true : false;
};

const getCurrentRoute = () => routes.find(route => routeIsActive(route.path));

export const drawerIsHidden = () => {
  const currentRoute = getCurrentRoute();
  return currentRoute?.hideDrawer;
};

const Drawer = ({ history }) => {
  const {
    state: { drawer },
    dispatch,
  } = useContext(AppContext);

  const _handleDrawerClickaway = () => {
    _toggleDrawer();
  };

  const _toggleDrawer = () => {
    dispatch(
      setDrawer({
        open: !drawer.open,
      }),
    );
  };

  const _handleBannerClick = () => {
    history.push('/');
  };

  const renderLink = (link, linkIndex) => {
    const linkIsActive = routeIsActive(link.path);

    return (
      <NavLink
        key={linkIndex}
        className={cx(
          'text-lg py-3 my-2 px-4 rounded flex flex-row items-center hover:opacity-75',
          linkIsActive && 'bg-gray-400',
        )}
        to={link.path}
        onClick={_toggleDrawer}
      >
        <link.icon className="mr-4 text-xl" />
        <span>{link.drawerLabel}</span>
      </NavLink>
    );
  };

  const hideDrawer = drawerIsHidden();

  if (hideDrawer) return null;

  return (
    <React.Fragment>
      <div
        id="app-drawer"
        className={cx(
          'hide-scrollbar app-drawer',
          drawer.open && !hideDrawer ? 'app-drawer-mobile.active' : 'app-drawer-mobile',
        )}
      >
        {/* content wrapper */}
        <div data-role="content-wrapper" className="p-4">
          {/* header */}
          <div className="text-3xl text-center flex flex-row justify-center">
            <img
              src={reactIcon}
              className="width-full cursor-pointer"
              onClick={_handleBannerClick}
              style={{ height: 100 }}
            />
          </div>

          <div className="flex flex-col mt-5">{routes.filter(r => !r.hidden).map(renderLink)}</div>
        </div>
      </div>
      <div
        onClick={_handleDrawerClickaway}
        className={cx('app-drawer-clickaway md:hidden', !drawer.open && 'hidden')}
      />
    </React.Fragment>
  );
};

Drawer.propTypes = {};
Drawer.defaultProps = {};

export default withRouter(Drawer);
