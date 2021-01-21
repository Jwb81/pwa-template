import React, { useEffect, useState, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import classes from './Login.module.css';
import cx from 'classnames';
import { login } from '../../services';
import { Text, Button } from '../../components/inputs';
import { PulseContainerSpinner } from '../../components/Spinners';
import { renderInput, v } from '../../helpers/inputs';
import { FaChevronRight } from 'react-icons/fa';
import { AppContext, setIsAuthenticated, setSnackbar, setUser } from '../../context/AppContext';
import { USERNAME_KEY, REMEMBER_ME_KEY, USER_ID_KEY, API_TOKEN_KEY } from '../../constants/storage';

const inputSections = [
  {
    field: 'username',
    label: 'Username',
    type: 'text',
    classes: 'md:w-full',
    required: true,
    // initValue: 'mdoraty',
  },
  {
    field: 'password',
    label: 'Password',
    type: 'password',
    classes: 'md:w-full',
    required: true,
    // initValue: 'Mount2017!',
  },
  {
    field: 'rememberMe',
    label: 'Remember Me',
    type: 'checkbox',
    classes: '',
    // initValue: false,
  },
];

const generateInitialFormValueState = () => {
  const initState = inputSections.flat().reduce((acc, cur) => {
    const initVal = cur.initValue !== undefined ? cur.initValue : '';
    // const initVal = cur.options ? cur.options[0].value : "";
    acc[cur.field] = initVal;
    return acc;
  }, {});

  return initState;
};

const sleep = async ms => new Promise(resolve => setTimeout(resolve, ms));

const LoginScreen = ({ history, location, match }) => {
  const [formValues, setFormValues] = useState(generateInitialFormValueState());
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const {
    state: { user },
    dispatch,
  } = useContext(AppContext);

  const handleFormSubmission = async evt => {
    evt.preventDefault();

    try {
      setIsAuthenticating(true);

      // const result = await login(formValues.username, formValues.password);
      await sleep(1000);

      const result = {
        username: 'babyjay',
      };

      const shouldRememberMe = formValues.rememberMe;

      // store the username in local storage
      localStorage.setItem(REMEMBER_ME_KEY, shouldRememberMe);

      // save the username if the use wants to be remembered
      if (shouldRememberMe) {
        localStorage.setItem(USERNAME_KEY, result.username);
      }

      dispatch(setIsAuthenticated(true));
      dispatch(setUser(result));
      dispatch(
        setSnackbar({
          variant: 'success',
          message: `Welcome ${result.username}!`,
          open: true,
        }),
      );
    } catch (error) {
      console.log(error);
      dispatch(
        setSnackbar({
          variant: 'error',
          message: `Login failed`,
          open: true,
        }),
      );
    }

    setIsAuthenticating(false);
  };

  const updateFormValues = (field, type) => (evt, valueOverride) => {
    const { value } = evt.currentTarget;

    setFormValues({
      ...formValues,
      [field]: valueOverride !== undefined ? valueOverride : value,
    });
  };

  useEffect(() => {
    // check for rememberMe and username
    const savedRememberMe = localStorage.getItem(REMEMBER_ME_KEY);
    const savedUsername = localStorage.getItem(USERNAME_KEY);

    const shouldRememberMe = savedRememberMe === 'true';

    setFormValues({
      ...formValues,
      rememberMe: shouldRememberMe,
      username: shouldRememberMe ? savedUsername : '',
    });
  }, []);

  if (user?.isAuthenticated) {
    const { from } = location.state || { from: { pathname: '/' } };
    return <Redirect to={from} />;
  }

  return (
    <form className="w-11/12 md:w-1/3 bg-white shadow-md rounded px-8 pt-6 pb-8 my-4" onSubmit={handleFormSubmission}>
      {inputSections.map((section, idx) => (
        <div key={`input-section-${idx}`} className="flex flex-wrap -mx-3 mb-6">
          {/* {inputSection.map((section, idx) =>
              renderInput(section, idx, formValues, updateFormValues)
            )} */}
          {renderInput(section, idx, formValues, updateFormValues)}
        </div>
      ))}

      <div className="flex items-center justify-end">
        {/* <div className="flex-1 text-center">
            <PulseContainerSpinner width={80} />
            {isAuthenticating && <PulseContainerSpinner width={80} />}
          </div> */}

        <div className="flex-1 flex flex-row justify-end">
          <div className="h-10">
            {isAuthenticating ? (
              <PulseContainerSpinner width={80} />
            ) : (
              <Button type="submit">
                Login <FaChevronRight className="inline ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default LoginScreen;
