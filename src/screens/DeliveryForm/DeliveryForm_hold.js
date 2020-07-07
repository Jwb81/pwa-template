import React, { useEffect, useState, useContext } from 'react';
import cx from 'classnames';
import { postNewImages, postNewFieldIssue } from '../../services/requests';
import { FaChevronRight, FaWindowClose } from 'react-icons/fa';
import { MdMyLocation } from 'react-icons/md';
import { renderInput, generateInitialFormValueState, v, checkInputValidity } from 'helpers/inputs';
import { Form } from 'components/inputs';
import { PulseContainerSpinner } from 'components/Spinners';
import { Text, Button } from 'components/inputs';
import { isSmScreen } from 'helpers/screenSize';
import { findUniqueArray } from 'helpers/functions';
import { AppContext } from 'context/AppContext';
import { setSnackbar } from 'context/AppContext';

const IMAGE_INPUT_ID = 'image-upload';

const getCoordinates = () => {
  return new Promise(function(resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const atPropertyOptions = [
  {
    value: '',
    label: 'Please select an option',
  },
  {
    value: 1,
    label: 'Yes',
  },
  {
    value: 2,
    label: `No`,
  },
];

const conditionOptions = [
  {
    value: '',
    label: 'Select a package condition',
  },
  {
    value: 1,
    label: 'Good (box/product in good condition)',
  },
  {
    value: 2,
    label: `Average (box has small scuffs or dents)`,
  },
  {
    value: 3,
    label: `Poor (box/product is damaged)`,
  },
];

const locationOptions = [
  {
    value: 'at',
    label: 'On location',
  },
  {
    value: 'away',
    label: 'Off premises (input required)',
  },
];
const hideIssueExplanation = (_, formValues) => parseInt(formValues?.issueId) !== 3;
const issueExplanationValidation = (message = 'Required') => (value, formValues) =>
  hideIssueExplanation(null, formValues) ? undefined : value ? undefined : message;

const DeliveryForm = ({ history }) => {
  const [imageFiles, setImageFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingCoords, setLoadingCoords] = useState(false);
  const [errors, setErrors] = useState({});

  const {
    state: { user },
    dispatch,
  } = useContext(AppContext);

  const inputList = [
    {
      field: '',
      label: 'Basic Info',
      type: 'h3',
      classes: '',
    },
    {
      field: 'deliveryCompleted',
      label: 'Did you complete the delivery',
      type: 'select',
      placeholder: '',
      classes: '',
      options: atPropertyOptions,
      validate: [v.required()],
      // initValue: 1,
    },
    {
      field: '',
      label: 'Package Condition',
      type: 'h3',
      classes: 'mt-6',
    },
    {
      field: 'conditionId',
      label: null,
      type: 'select',
      classes: '',
      options: conditionOptions,
      validate: [v.required()],
      // initValue: 2,
    },
    {
      field: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Please describe any issues with the delivery (if any)',
      classes: '',
      rows: 6,
      validate: [v.required()],
      // initValue: 'The ditch was washed out.',
    },
    {
      field: '',
      label: 'Delivery Location',
      type: 'h3',
      classes: 'mt-6',
    },
    {
      field: 'location',
      label: 'Where are you?',
      type: 'radio',
      classes: 'md:w-full md:mb-4 mb-3',
      options: locationOptions,
      validate: [v.required()],
      // initValue: 'away',
    },
    {
      field: 'lat',
      label: 'Latitude',
      type: 'number',
      step: 'any',
      classes: 'md:w-1/2',
      // placeholder: 'Enter photo latitude...',
      validate: [v.required()],
    },
    {
      field: 'long',
      label: 'Longitude',
      type: 'number',
      step: 'any',
      classes: 'md:w-1/2',
      // placeholder: 'Enter photo longitude...',
      validate: [v.required()],
    },
    {
      field: '',
      type: 'custom',
      component: (
        <div className="w-auto flex flex-row justify-start items-center my-4 ml-3">
          <PulseContainerSpinner />
        </div>
      ),
      hide: !loadingCoords,
    },
  ];

  const [formValues, setFormValues] = useState(generateInitialFormValueState(inputList));

  const resetPage = () => {
    // set formValues back to their defaults
    setFormValues(generateInitialFormValueState(inputList));
    setErrors({});
    setImageFiles([]);
    setIsSubmitting(false);
    setLoadingCoords(false);
  };

  const handleUploadFormSubmission = async evt => {
    evt.preventDefault();

    setErrors({});

    // run validations
    const validationErrors = inputList.reduce((acc, cur) => {
      // check if validations exist
      if (!cur.validate || !cur.validate.length) return acc;

      const errorMessage = checkInputValidity(cur, formValues[cur.field], formValues);

      if (errorMessage) {
        acc[cur.field] = errorMessage;
      }

      return acc;
    }, {});

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length) {
      return;
    }

    // get the images from the state array
    const photos = imageFiles.map(({ file }) => file);

    const { location, ...sanitized } = formValues;

    const dataToSend = {
      ...sanitized,
      photos,
      userId: user.userId,
    };

    try {
      setIsSubmitting(true);
      const result = await postNewFieldIssue(dataToSend);
      console.log(result);
      dispatch(
        setSnackbar({
          open: true,
          message: 'Issue submitted successfully',
          variant: 'success',
        }),
      );

      // reset the page for another submission
      resetPage();
    } catch (error) {
      console.log(error);
      dispatch(
        setSnackbar({
          open: true,
          message: 'There was a problem submitting your issue...',
          variant: 'error',
        }),
      );
    }
    setIsSubmitting(false);
  };

  const customOnChangeFunctions = {
    location: async ({ location }) => {
      if (!location) return;

      setFormValues({
        ...formValues,
        location,
        lat: '',
        long: '',
      });

      if (location === 'at') {
        // if the user is at the location, fetch their coords
        // getLocation(getLocationCallback);
        try {
          setLoadingCoords(true);
          const {
            coords: { latitude, longitude },
          } = await getCoordinates();
          setFormValues({
            ...formValues,
            location,
            lat: latitude,
            long: longitude,
          });
        } catch (error) {
          // console.log(error);
          if (error.code === 1) {
            // user denied geolocation
            window.alert('Please allow location tracking in order to automatically capture your coordinates');
          }
        }
        setLoadingCoords(false);
      }
    },
  };

  const updateFormValues = (field, type) => async (evt, valueOverride) => {
    const { value } = evt.currentTarget;

    const updatedFormValues = {
      ...formValues,
      [field]: valueOverride !== undefined ? valueOverride : value,
    };

    await setFormValues(updatedFormValues);

    customOnChangeFunctions[field] && customOnChangeFunctions[field](updatedFormValues);
  };

  const onImageAdded = () => {
    const images = Array.from(document.getElementById(IMAGE_INPUT_ID).files).map(img => {
      return {
        file: img,
        preview: URL.createObjectURL(img),
      };
    });

    // add images to the rest of the images
    // put the images first in case anything changed with a duplicated image but it keeps the same filename
    setImageFiles(imageFiles.concat(images));
  };

  const clearLoadedImages = evt => {
    evt.preventDefault();

    document.getElementById(IMAGE_INPUT_ID).value = null;
    setImageFiles([]);
  };

  const removePhoto = photoIdx => evt => {
    setImageFiles(imageFiles.slice(0, photoIdx).concat(imageFiles.slice(photoIdx + 1)));
  };

  return (
    <Form
      onSubmit={handleUploadFormSubmission}
      classes={cx('md:w-3/4', loadingCoords && 'opacity-50')}
      style={{ pointerEvents: loadingCoords ? 'disabled' : 'auto' }}
    >
      {inputList
        .filter(input => {
          return !input.hide || (typeof input.hide === 'function' && !input.hide(input, formValues));
        })
        .map((input, idx) => (
          <div key={`input-${idx}`} className="flex flex-wrap -mx-3 flex-col justify-center">
            {renderInput(input, idx, formValues, updateFormValues, errors)}
          </div>
        ))}

      <div>
        <label htmlFor={IMAGE_INPUT_ID} className="block mb-2 mt-6">
          Choose images to upload (PNG, JPG)
        </label>
        <Button
          classes="mb-1"
          textClasses="text-white text-xs"
          bgClasses="bg-gray-700 hover:bg-gray-600"
          onClick={clearLoadedImages}
        >
          Clear images
        </Button>
        <input
          type="file"
          accept=".png,.jpg,.jpeg,.m4v,.mp4,.mov,.3pg.webm,.ts,.mkv"
          multiple
          id={IMAGE_INPUT_ID}
          name={IMAGE_INPUT_ID}
          className="hidden"
          // className="block w-100"
          onChange={onImageAdded}
          //
        />
        <Button
          onClick={evt => {
            evt.preventDefault();
            document.getElementById(IMAGE_INPUT_ID).click();
          }}
          textClasses="text-white text-xs ml-2"
        >
          Browse...
        </Button>
        <span className="ml-2 hidden md:inline">{imageFiles.length} images selected</span>
      </div>
      <span className="md:hidden">{imageFiles.length} images selected</span>

      {/* show image previews */}
      <div className="flex flex-row overflow-auto  -mx-2 mt-2">
        {imageFiles.map(({ file, preview }, photoIdx) => {
          if (
            ['.jpg', '.jpeg', '.png', '.m4v', '.mp4', '.mov', '.3pg', '.webm', '.ts', '.mkv'].some(ext =>
              file.name?.includes(ext),
            )
          ) {
            return (
              <React.Fragment>
                <img
                  key={preview}
                  src={preview}
                  className="select-none mx-2 w-auto" // mx-2 is 0.5rem margins
                  style={{ height: 100 }}
                />
                <span className="text-2xl text-red-500" style={{ marginLeft: 'calc(-0.5rem - 24px)', marginTop: -2 }}>
                  <span className="cursor-pointer" onClick={removePhoto(photoIdx)}>
                    <FaWindowClose />
                  </span>
                </span>
              </React.Fragment>
            );
          }

          return (
            <div>
              {file.name} - {file.size} bytes
            </div>
          );
        })}
      </div>

      <div className="flex flex-row justify-between items-center mt-4">
        <div className="mr-10">
          <span className={cx('text-red-500', !Object.keys(errors).length && 'hidden')}>
            Please fix the errors above...
          </span>
        </div>

        <div>
          {isSubmitting ? (
            <PulseContainerSpinner width={75} />
          ) : (
            <Button type="submit" disabled={!imageFiles.length} style={{ width: 120 }}>
              Upload! <FaChevronRight className="inline ml-2" />
            </Button>
          )}
        </div>
      </div>
    </Form>
  );
};

export default DeliveryForm;
