import React, { useEffect, useState } from 'react';
import classes from './Dashboard.module.css';
import cx from 'classnames';
import { postScrapingProfile } from '../../services/requests';
import { Text, Button, Form } from '../../components/inputs';
import { renderInput } from '../../helpers/inputs';
import { FaChevronRight } from 'react-icons/fa';
import { format } from 'date-fns';

// icons
import awaitingPickupIcon from 'assets/icons/tracking/awaiting_pickup_icon.png';
import shippedIcon from 'assets/icons/tracking/shipping_icon.png';
import outForDeliveryIcon from 'assets/icons/tracking/out_for_delivery_icon.png';
import deliveredIcon from 'assets/icons/tracking/delivered_icon.png';

const shippingStatuses = {
  AWAITING_PICKUP: 'AWAITING_PICKUP',
  SHIPPED: 'SHIPPED',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
};

const shippingStatusDescriptions = {
  AWAITING_PICKUP: 'Awaiting Pickup from Carrier',
  SHIPPED: 'Shipped',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
};

const shippingStatusIcons = {
  AWAITING_PICKUP: awaitingPickupIcon,
  SHIPPED: shippedIcon,
  OUT_FOR_DELIVERY: outForDeliveryIcon,
  DELIVERED: deliveredIcon,
};

const myOrders = [
  {
    dateOrdered: new Date(2020, 5, 22),
    estimatedDelivery: new Date(2020, 5, 29),
    trackingNumber: '9407 3000 0000 0000 0000 00',
    shippingMethod: 'Certified Mail',
    currentStatus: shippingStatuses.AWAITING_PICKUP,
  },
  {
    dateOrdered: new Date(2020, 5, 18),
    estimatedDelivery: new Date(2020, 5, 27),
    trackingNumber: '9400 1000 0000 0000 0000 00',
    shippingMethod: 'Mail Tracking',
    currentStatus: shippingStatuses.SHIPPED,
  },
  {
    dateOrdered: new Date(2020, 5, 1),
    estimatedDelivery: new Date(2020, 5, 4),
    // deliveredDate: new Date(2020, 5, 4),
    trackingNumber: '9205 5000 0000 0000 0000 00',
    shippingMethod: 'Priority Mail',
    currentStatus: shippingStatuses.OUT_FOR_DELIVERY,
  },
  {
    dateOrdered: new Date(2020, 3, 2),
    estimatedDelivery: new Date(2020, 3, 6),
    deliveredDate: new Date(2020, 3, 5),
    trackingNumber: '9270 1000 0000 0000 0000 00',
    shippingMethod: 'Priority Mail Express',
    currentStatus: shippingStatuses.DELIVERED,
  },
];

console.log(new Date(2020, 5, 18));

const Dashboard = ({ history }) => {
  const renderOrderCard = (order, idx) => {
    const { dateOrdered, estimatedDelivery, deliveredDate, trackingNumber, shippingMethod, currentStatus } = order;
    //

    return (
      <div class="md:flex items-center justify-between bg-white rounded-lg p-6 border-solid border-2 mb-4">
        <img class="h-16 w-16 md:h-16 md:w-16 mx-auto md:mx-0 md:mr-6" src={shippingStatusIcons[currentStatus]} />
        <div class="text-center md:text-right mt-4 md:mt-0">
          {deliveredDate ? (
            <h2 class="text-lg">Delivered Date: {format(deliveredDate, 'M-dd')}</h2>
          ) : (
            <h2 class="text-lg">Estimated Delivery: {format(estimatedDelivery, 'M-dd')}</h2>
          )}
          <a class="text-md">{trackingNumber}</a>
          <div class="text-purple-500">
            Shipping Method:<strong>{shippingMethod}</strong>
          </div>
          <div class="text-gray-600">
            Status: <strong>{shippingStatusDescriptions[currentStatus]}</strong>
          </div>
          <div class="text-gray-600">Date Ordered: {format(dateOrdered, 'M-dd')}</div>
        </div>
      </div>
    );
  };

  return (
    <React.Fragment>
      <Form classes="md:w-1/3">
        {/* <div className="text-xl text-center">
          This page is coming soon. Head on over to the issue form to submit a new issue.
        </div> */}

        <div className="text-3xl font-bold text-center mb-4">My Packages</div>

        <div className="flex flex-col">{myOrders.map(renderOrderCard)}</div>
      </Form>
    </React.Fragment>
  );
};

export default Dashboard;
