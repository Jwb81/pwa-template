import React, { useState, useRef, useEffect, useContext } from 'react';
import { withGoogleMap, GoogleMap, withScriptjs, Marker, InfoWindow, Polyline } from 'react-google-maps';
import { MAP } from 'react-google-maps/lib/constants';
import { getAppMapData } from 'services';
import { AppContext } from 'context/AppContext';
import { setSnackbar } from 'context/AppContext';
import { FiInfo, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import cx from 'classnames';
import { PulseContainerSpinner } from 'components/Spinners';
import { Button } from 'components/inputs';
import Modal from 'components/Modal';
import { isMobileDevice } from 'helpers/deviceInfo';

const googleMapKey = process.env.REACT_APP_GOOGLE_MAP_KEY;

const TRUCK_DATA_FETCH_INTERVAL = 20 * 1000;

const DefaultGoogleMap = ({ defaultCenter, children, ...restProps }) => (
  <GoogleMap defaultZoom={7} options={{ minZoom: 7 }} defaultCenter={defaultCenter} {...restProps} mapcontrol>
    {children}
  </GoogleMap>
);

const CustomMap = withScriptjs(withGoogleMap(DefaultGoogleMap));

const TruckPopupModalFooter = ({ currentImageIndex, totalImages, setOpen, showPreviousImage, showNextImage }) => {
  return (
    <React.Fragment>
      <div className="flex flex-row items-center select-none">
        <span className="p-2 cursor-pointer text-3xl" onClick={showPreviousImage}>
          <FiChevronLeft />
        </span>
        Image {currentImageIndex} of {totalImages}
        <span className="p-2 cursor-pointer text-3xl" onClick={showNextImage}>
          <FiChevronRight />
        </span>
      </div>
      <div>
        <Button onClick={() => setOpen(false)}>Close</Button>
      </div>
    </React.Fragment>
  );
};

const TruckPopupModal = ({ open, setOpen, truck, showPreviousImage, showNextImage, focusedImageIndex }) => {
  if (!truck || !truck.popup.length) return null;

  const { truckname, popup } = truck;
  const { popmedialoc, popnote } = popup[focusedImageIndex];

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      header={'View Photos'}
      footer={
        <TruckPopupModalFooter
          currentImageIndex={focusedImageIndex + 1}
          totalImages={popup.length}
          setOpen={setOpen}
          showPreviousImage={showPreviousImage}
          showNextImage={showNextImage}
        />
      }
    >
      <div className="flex flex-col">
        <img src={popmedialoc} className="w-full" />
        <div className="pt-2 text-center w-full">
          <span className="font-bold">{truckname}</span>: {popnote}
        </div>
      </div>
    </Modal>
  );
};

const TruckBreadcrumbs = ({ truck, hideInfoDrawer }) => {
  const [selectedWaypointImage, setSelectedWaypointImage] = useState(null);

  const handleMediaMarkerClick = imageUri => () => {
    hideInfoDrawer();
    setSelectedWaypointImage(imageUri);
  };

  const handleMediaMarkerCloseClick = () => setSelectedWaypointImage(null);

  if (!truck) return null;

  const { truckname } = truck;

  // get the points for the polyline
  const breadcrumbPoints = truck.waypoints.map(({ reclaimed, waylat, waylon, waymedialoc, waynote }) => ({
    reclaimed,
    waymedialoc,
    waynote,
    lat: waylat,
    lng: waylon,
  }));

  // get the reclaimed points
  const reclaimedPoints = breadcrumbPoints.filter(p => p.reclaimed);

  // get images along the route
  const mediaPoints = breadcrumbPoints.filter(p => p.waymedialoc);

  return (
    <React.Fragment>
      {/* breadcrumb points */}
      <Polyline
        geodesic={true}
        options={{
          path: breadcrumbPoints,
          strokeColor: 'blue',
          strokeOpacity: 1.0,
          strokeWeight: 3,
        }}
      />

      {/* reclaimed points */}
      {reclaimedPoints.map(({ lat, lng }, rpIdx) => (
        <Marker
          key={`reclaimed_point_${rpIdx}`}
          position={{ lat, lng }}
          icon={{ path: window.google.maps.SymbolPath.CIRCLE, scale: 2, strokeColor: 'orange' }}
        />
      ))}

      {/* image points */}
      {mediaPoints.map(({ lat, lng, waymedialoc, waynote }, mpIdx) => (
        <Marker
          key={`media_point_${mpIdx}`}
          position={{ lat, lng }}
          // icon={cameraIcon}
          onClick={handleMediaMarkerClick(waymedialoc)}
        >
          {selectedWaypointImage === waymedialoc && (
            <InfoWindow onCloseClick={handleMediaMarkerCloseClick}>
              <div>
                <img src={waymedialoc} className="w-full" style={{ maxWidth: 300 }} />
                <div className="w-full text-center mt-2">
                  <span className="font-bold">{truckname}</span>: {waynote.replace('Headed', '')}
                </div>
              </div>
            </InfoWindow>
          )}
        </Marker>
      ))}
    </React.Fragment>
  );
};

const getTruckModifications = truck => {
  var doesTruckTriggerAlert = false;
  // (SpeedAlertPU == true && truck.spreading == true && truck.speedmph > SpeedAlertPUVal) ||
  // (SpeedAlertPD == true && truck.spreading == true && truck.speedmph > SpeedAlertPDVal) ||
  // (AppRate == true && truck.spreadingrate > AppRateVal) ||
  // (IdleTime == true && truck.idletime > IdleTimeVal);

  const { heading, isoffline, spreading } = truck;

  let iconHeading = heading || '';
  let iconColor = doesTruckTriggerAlert ? 'Red' : '';
  let iconMods =
    (spreading ? 'Spreading' : '') + (isoffline ? 'Nosignal' : '') + (!spreading && !isoffline ? 'Base' : '');

  const iconName = `truck${iconHeading}${iconColor}${iconMods}`;

  const truckMods = {
    iconName,
    x: 20, // defaults
    y: 30, // defaults
    ...getTruckHeadingOffset(heading),
  };

  return truckMods;
};

const getTruckHeadingOffset = heading => {
  let pushpos = {};

  switch (heading) {
    case 'N':
      pushpos.x = 20;
      pushpos.y = 15;
      break;
    case 'NE':
      pushpos.x = 25;
      pushpos.y = 15;
      break;
    case 'NW':
      pushpos.x = 20;
      pushpos.y = 15;
      break;
    case 'W':
      pushpos.x = 15;
      pushpos.y = 20;
      break;
    case 'E':
      pushpos.x = 30;
      pushpos.y = 25;
      break;
    case 'SW':
      pushpos.x = 15;
      pushpos.y = 25;
      break;
    case 'SE':
      pushpos.x = 25;
      pushpos.y = 30;
      break;
    case 'S':
      pushpos.x = 20;
      pushpos.y = 30;
      break;
  }
  return pushpos;
};

/**
 * @param { Number } lat  defaulted to a place in Ohio
 * @param { Number } lng  defaulted to a place in Ohio
 */
const Map = ({ lat = 40.4173, lng = -82.9071, ...restProps }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  const [mapContainerHeight, setMapContainerHeight] = useState(0);
  const [showInfoDrawer, setShowInfoDrawer] = useState(false);
  const [garages, setGarages] = useState(null);
  const [trucks, setTrucks] = useState(null);
  const [selectedGarage, setSelectedGarage] = useState(null);
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [focusedTruckImageIndex, setFocusedTruckImageIndex] = useState(0);
  const [shouldFetchTruckData, setShouldFetchTruckData] = useState(false);

  let truckFetchTimer = useRef(null);

  const {
    state: { user },
    dispatch,
  } = useContext(AppContext);

  const getAppMapDataAsync = async (entity, opts) => {
    try {
      const results = await getAppMapData(user?.userId, entity, opts);
      return results[entity];
    } catch (error) {
      dispatch(setSnackbar({ open: true, variant: 'error', message: 'Failed to fetch map data' }));
      return null;
    }
  };

  const getAppMapTruckData = async () => {
    const results = await getAppMapDataAsync('trucks', true);

    if (results) {
      // get truck icons and push positions
      let updatedTrucks = results.map(truck => {
        const mods = getTruckModifications(truck);

        truck.iconName = mods.iconName;
        truck.anchorX = mods.x || 0;
        truck.anchorY = mods.y || 0;

        return truck;
      });

      // console.log('trucks', updatedTrucks);

      setTrucks(updatedTrucks);
    } else {
      dispatch(
        setSnackbar({
          open: true,
          variant: 'error',
          message: 'Failed to fetch truck data... please try refreshing',
        }),
      );
    }

    setShouldFetchTruckData(true);
  };
  const getAppMapGarageData = async () => {
    const results = await getAppMapDataAsync('garages');
    // console.log('garages', results);

    if (results) {
      setGarages(results);
    } else {
      dispatch(
        setSnackbar({
          open: true,
          variant: 'error',
          message: 'Failed to fetch garage data... please try refreshing',
        }),
      );
    }
  };

  const handleGarageMarkerClick = garage => () => {
    setSelectedTruck(null);
    setSelectedGarage(garage);

    setShowInfoDrawer(true);
  };
  const handleTruckMarkerClick = truck => () => {
    setSelectedGarage(null);
    setSelectedTruck(truck);

    setShowInfoDrawer(true);
  };

  const handleMapClick = evt => {
    setShowInfoDrawer(false);
  };

  const toggleInfoDrawer = () => {
    setShowInfoDrawer(!showInfoDrawer);
    // setModalOpen(true);
  };

  const handleTruckImageClick = popupIndex => () => {
    setFocusedTruckImageIndex(popupIndex);
    setModalOpen(true);
  };

  const showPreviousTruckImage = () => {
    setFocusedTruckImageIndex(
      focusedTruckImageIndex === 0 ? selectedTruck?.popup.length - 1 : focusedTruckImageIndex - 1,
    );
  };
  const showNextTruckImage = () => {
    setFocusedTruckImageIndex(
      focusedTruckImageIndex === selectedTruck?.popup.length - 1 ? 0 : focusedTruckImageIndex + 1,
    );
  };

  const renderGarageDetails = () => {
    const { GarageName, Address, CountyName, Owned, Lat, Long } = selectedGarage;

    return (
      <React.Fragment>
        <div className="font-bold text-2xl mb-4 text-center w-full">Garage Details</div>

        <div className="font-bold mb-2 text-lg text-center w-full">{GarageName}</div>
        {/* <span>Garage ID: {selectedGarage.GarageId}</span> */}
        <span>Address: {Address}</span>
        <span>County: {CountyName}</span>
        <span>Owned: {Owned ? 'Yes' : 'No'}</span>
        <span>Lat: {Lat}</span>
        <span>Long: {Long}</span>
      </React.Fragment>
    );
  };

  const renderTruckDetails = () => {
    const { truckname, RouteName, heading, speedmph, popup } = selectedTruck;

    return (
      <React.Fragment>
        <div className="font-bold text-2xl mb-4 text-center w-full">Truck: {truckname}</div>

        <div className="mb-2 text-lg text-center">
          {RouteName.substr(0, 2) === 'At'
            ? RouteName
            : `
            Heading ${heading} on ${RouteName} at ${speedmph} mph.
            `}
        </div>

        {/* take out the container div to make the container element scroll instead of just the images */}
        <div className="overflow-auto">
          {!!popup &&
            popup
              .sort((a, b) => (a.popord < b.popord ? -1 : 1))
              .map(({ popmedialoc, popnote, popord, poptime }, popupIndex) => (
                <React.Fragment>
                  <img
                    className="w-full mt-4 cursor-pointer"
                    src={popmedialoc}
                    alt={popnote}
                    title={popnote}
                    onClick={handleTruckImageClick(popupIndex)}
                  />
                  <div className="w-full text-center">{poptime}</div>
                </React.Fragment>
              ))}
        </div>
      </React.Fragment>
    );
  };

  useEffect(() => {
    if (mapContainerRef.current) {
      setMapContainerHeight(mapContainerRef.current.clientHeight);
    }
  }, [mapContainerRef.current]);

  useEffect(() => {
    if (shouldFetchTruckData) {
      setShouldFetchTruckData(false);
      truckFetchTimer.current = setTimeout(getAppMapTruckData, TRUCK_DATA_FETCH_INTERVAL);
    }
  }, [shouldFetchTruckData]);

  useEffect(() => {
    getAppMapTruckData();
    getAppMapGarageData();

    return () => {
      clearTimeout(truckFetchTimer.current);
    };
  }, []);

  const popup = selectedTruck?.popup;

  return (
    <div className="w-full relative flex-1 overflow-hidden" ref={mapContainerRef}>
      <CustomMap
        ref={mapRef}
        mapElement={<div id={'GoogleMap'} className="h-full" />}
        yesIWantToUseGoogleMapApiInternals
        googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.41&key=${googleMapKey}`}
        loadingElement={
          <div className="h-full">
            <PulseContainerSpinner />
          </div>
        }
        containerElement={<div style={{ height: mapContainerHeight, minWidth: '100%' }} />}
        defaultCenter={{ lat, lng }}
        onClick={handleMapClick}
      >
        {/* GARAGES */}
        {!!garages &&
          garages.map(garage => (
            <Marker
              // id={`garage_${garage.GarageId}`}
              key={`garage_${garage.GarageId}`}
              position={{ lat: garage.Lat, lng: garage.Long }}
              defaultIcon={null}
              onClick={handleGarageMarkerClick(garage)}
            />
          ))}

        {/* TRUCKS */}
        {!!trucks &&
          trucks
            .filter(truck => truck.active && truck.RouteName.substr(0, 2).indexOf('At') == -1)
            .map(truck => (
              <Marker
                // id={`truck-${truck.deviceid}`}
                key={`truck-${truck.deviceid}`}
                position={{ lat: truck.lat, lng: truck.lon }}
                icon={{
                  // url: mapIcons[truck.iconName] || mapIcons.truckEBase,
                  // url: mailTruckIcon,
                  anchor: new window.google.maps.Point(truck.anchorX, truck.anchorY),
                }}
                onClick={handleTruckMarkerClick(truck)}
              />
            ))}

        {/* BREADCRUMBS */}
        <TruckBreadcrumbs
          key={selectedTruck?.deviceId}
          truck={selectedTruck}
          hideInfoDrawer={() => setShowInfoDrawer(false)}
        />
      </CustomMap>

      <div className={cx('map-info-drawer flex flex-col overflow-auto', showInfoDrawer && 'active')}>
        <div className="flex flex-row justify-end items-center py-4 px-5 sticky top-0 bg-gray-200">
          <span className="p-1 rounded-full hover:bg-gray-400 cursor-pointer" onClick={toggleInfoDrawer}>
            <FiX className="text-lg" />
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-start items-start p-5 pt-0 overflow-auto">
          {selectedGarage && renderGarageDetails()}

          {selectedTruck && renderTruckDetails()}

          {!selectedGarage && !selectedTruck && (
            <div className="text-center text-gray-600">
              Please select a truck or a garage on the map to see more details...
            </div>
          )}
        </div>

        <div className="flex flex-row justify-between items-center py-4 px-5 sticky top-0 bg-gray-200">
          {!!selectedTruck && (
            <React.Fragment>
              <Button bgClasses="bg-blue-500 hover:shadow-lg outline-none">Live Video</Button>
              <Button bgClasses="bg-blue-500 hover:shadow-lg outline-none">Take Pic</Button>
            </React.Fragment>
          )}
        </div>
      </div>

      <div
        className={cx(
          'absolute top-0 right-0 flex justify-center items-center shadow cursor-pointer rounded-l-full bg-black text-white',
        )}
        style={{
          width: 40,
          height: 40,
          top: isMobileDevice ? 10 : 60,
        }}
        onClick={toggleInfoDrawer}
      >
        <FiInfo className="text-2xl " />
      </div>

      <TruckPopupModal
        open={modalOpen}
        setOpen={setModalOpen}
        truck={selectedTruck}
        focusedImageIndex={focusedTruckImageIndex}
        showPreviousImage={showPreviousTruckImage}
        showNextImage={showNextTruckImage}
        //
      />
    </div>
  );
};
export default Map;
