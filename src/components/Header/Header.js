import React, { useContext } from 'react';
import reactLogo from 'assets/images/logo512.png';
import { RiAccountCircleLine } from 'react-icons/ri';
import { FiLogOut, FiLogIn, FiMenu } from 'react-icons/fi';
import { Button } from '../inputs';
import { AppContext, setDrawer, logoutUser } from '../../context/AppContext';
import { withRouter } from 'react-router-dom';
import routes from 'constants/routes';
import { drawerIsHidden } from 'components/Drawer';

const routeIsActive = ({ exact, path }) => {
  const windowPathname = window.location.pathname;
  return exact ? windowPathname === path : windowPathname.includes(path);
};

const Header = withRouter(({ history, location, match }) => {
  const {
    state: { user, drawer },
    dispatch,
  } = useContext(AppContext);

  const isLoginPage = location.pathname.includes('/login');
  const activeRoute = routes.find(routeIsActive);
  const hideDrawer = drawerIsHidden();

  const goToLogin = () => {
    history.push('/login');
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    history.push('/login');
  };

  const handleBannerClick = () => {
    history.push('/');
  };

  const openDrawer = () => {
    dispatch(
      setDrawer({
        open: true,
      }),
    );
  };

  const renderTopHeader = () => (
    <div className="flex flex-row justify-between items-center p-4 shadow-sm" style={{ minHeight: 72 }}>
      {/* USOS logo */}
      <div>
        {/*  */}
        {<img src={reactLogo} onClick={handleBannerClick} className="h-8 cursor-pointer md:hidden" />}
      </div>

      {/* auth button */}
      {user?.isAuthenticated && (
        <div className="flex flex-row items-center">
          <span>{user && user.username}</span>
          <span className="ml-2 p-2 hover:bg-gray-400 cursor-pointer rounded-full" onClick={handleLogout}>
            <FiLogOut className="text-2xl" />
          </span>
        </div>
      )}

      {!isLoginPage && !user?.isAuthenticated && (
        <div>
          <Button
            onClick={goToLogin}
            classes="flex flex-row items-center focus:shadow-none"
            bgClasses="bg-transparent hover:bg-gray-400"
            textClasses="text-black"
          >
            <span>Sign in</span>
            <span className="ml-2">
              <FiLogIn className="text-2xl" />
            </span>
          </Button>
        </div>
      )}
    </div>
  );

  const renderBottomHeader = () => (
    <React.Fragment>
      {/* second header bar with drawer icon */}
      <div className="flex flex-row justify-between items-center p-4 shadow-lg bg-blue-500 text-white">
        <div className="flex-1">
          {!hideDrawer && <FiMenu className="text-2xl cursor-pointer md:hidden" onClick={openDrawer} />}
        </div>

        {/* page title */}
        <div className="text-center text-xl" style={{ flex: 2 }}>
          {activeRoute?.pageTitle}
        </div>

        <div className="flex-1 text-right text-xs">
          {/*  */}
          {/*  */}
        </div>
      </div>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      {!isLoginPage && renderTopHeader()}
      {renderBottomHeader()}
    </React.Fragment>
  );
});

export default Header;
