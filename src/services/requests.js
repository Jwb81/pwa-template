import { apiUrl, getHeaders, getApiToken } from './apiConfig';

const baseRoute = `${apiUrl}`;

/**
 *
 * @param {*} userId
 * @param { String } dataType truck || garage
 */
export const getAppMapData = async (userId, entity, onlyActiveReturn = false) => {
  const endpointExtension = entity === 'trucks' ? 'AppMapTruckData' : 'AppMapGarageData';
  const url = `${baseRoute}/AVL/${endpointExtension}?onlyActiveReturn=${onlyActiveReturn}`;
  const token = getApiToken();

  let formData = new FormData();
  formData.append('userId', userId);
  formData.append('token', token);

  const requestOptions = {
    method: 'POST',
    headers: new Headers(),
    body: formData,
  };

  try {
    const response = await fetch(url, requestOptions);

    if (response.status !== 200) {
      return Promise.reject(response);
    }

    return await response.json();
  } catch (err) {
    if (err.name !== 'PostImagesBadRequest') {
      err.message = `: ${err.message}`;
    }
    throw err;
  }
};

export const postNewFieldIssue = async form => {
  // const url = `${baseRoute}/new-images`;
  const url = `${baseRoute}/avl/appdataupload`;
  const token = getApiToken();

  let formData = new FormData();
  var photoData = [];

  // add token to formData
  formData.append('token', token);

  Object.keys(form).forEach(key => {
    if (key === 'photos') {
      form.photos.forEach(file => {
        // const blob = new Blob([img]);

        formData.append('photos', file);

        let photoDataItem = {
          fileName: file.name,
          fieldname: file.name,
          // label: img.label,
        };
        photoData.push(photoDataItem);
      });

      // formData.append('photoData', JSON.stringify(photoData));
    } else {
      formData.append(key, form[key]);
    }
  });

  const requestOptions = {
    method: 'POST',
    headers: {
      Accept: 'multipart/form-data',
    },
    body: formData,
  };

  try {
    const response = await fetch(url, requestOptions);

    if (response.status !== 200) {
      var newError = new Error(`: ${response.text()}`);
      newError.name = 'PostImagesBadRequest';
      throw newError;
    } else {
      const uploadedImages = await response.json();
      return uploadedImages;
    }
  } catch (err) {
    if (err.name !== 'PostImagesBadRequest') {
      err.message = `: ${err.message}`;
    }
    throw err;
  }
};
