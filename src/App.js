import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter, Switch, Route, withRouter, Redirect } from 'react-router-dom';
import { PulseContainerSpinner } from 'components/Spinners';
import { AppContext, AppContextProvider, setUser } from 'context/AppContext';
import Header from 'components/Header';
import Footer from 'components/Footer';
import { verifyToken } from './services';
import Snackbar from 'components/Snackbar';
import Drawer, { drawerIsHidden } from 'components/Drawer';
import cx from 'classnames';

// screens
import DeliveryFormScreen from 'screens/DeliveryForm';
import LoginScreen from 'screens/Login';
import DashboardScreen from 'screens/Dashboard';
import SpinnersScreen from 'screens/SpinnerExamples';
import MapScreen from 'screens/Map';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [checkingAuth, setCheckingAuth] = useState(true);

  const {
    state: { user },
    dispatch,
  } = useContext(AppContext);

  const checkAuthorization = async () => {
    //
    try {
      const updatedUser = await verifyToken();
      dispatch(
        setUser({
          ...updatedUser,
          isAuthenticated: true,
        }),
      );
    } catch (error) {
      console.log(error);
      dispatch(setUser(null));
      // dispatch(
      //   setSnackbar({
      //     open: true,
      //     variant: 'error',
      //     message: error.statusText || 'Session expired.  Please login again',
      //   }),
      // );
    }
    setCheckingAuth(false);
  };

  useEffect(() => {
    checkAuthorization();
  }, []);

  return (
    <Route
      {...rest}
      render={props =>
        user?.isAuthenticated === true ? (
          <Component {...props} />
        ) : checkingAuth ? (
          <PulseContainerSpinner />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

const ScrollToTop = withRouter(({ children, history, location, match }) => {
  const [prevLocation, setPrevLocation] = useState(null);

  useEffect(() => {
    const { pathname } = location;

    // check if location has changed and scroll back to the top
    if (pathname !== prevLocation) {
      setPrevLocation(pathname);
      window.scroll({
        top: 0,
        behavior: 'smooth',
      });
    }
  });

  return children;
});

function App() {
  const [checkingAuth, setCheckingAuth] = useState(true);

  const {
    state: { user },
    dispatch,
  } = useContext(AppContext);

  const checkAuthorization = async () => {
    //
    try {
      const updatedUser = await verifyToken();
      dispatch(
        setUser({
          ...updatedUser,
          isAuthenticated: true,
        }),
      );
    } catch (error) {
      // console.log(error);
      dispatch(setUser(null));
    }
    setCheckingAuth(false);
  };

  useEffect(() => {
    checkAuthorization();
  }, []);

  const hideDrawer = drawerIsHidden();

  return (
    <React.Fragment>
      <BrowserRouter>
        <ScrollToTop>
          {/* menu drawer (popout on mobile, static on desktop) */}
          <Drawer />

          {/* rest of the app with margins to accommodate the drawer */}
          <div className={cx('app flex flex-col', !hideDrawer && 'app-drawer-margin')}>
            <Header />

            <div className="flex flex-1 flex-col self-stretch justify-center items-center">
              <Switch>
                <PrivateRoute exact path="/" component={DashboardScreen} />
                <Route exact path="/login" component={LoginScreen} />
                <PrivateRoute exact path="/delivery-form" component={DeliveryFormScreen} />
                <Route exact path="/spinners" component={SpinnersScreen} />
                <PrivateRoute exact path="/map" component={MapScreen} />
                {/* <PrivateRoute exact path="/map" component={props => <MapScreen {...props} lat={40.4173} lng ={-82.9071} />} /> */}
              </Switch>
            </div>

            <Footer />
          </div>
        </ScrollToTop>
      </BrowserRouter>

      <Snackbar />
    </React.Fragment>
  );
}

const WrappedApp = () => (
  <AppContextProvider>
    <App />
  </AppContextProvider>
);

export default WrappedApp;
