import React from 'react';

const currentYear = new Date().getFullYear();

const Copyright = props => (
  <p className="text-center text-gray-500 text-xs">&copy; {currentYear} Company. All rights reserved.</p>
);

export default Copyright;
