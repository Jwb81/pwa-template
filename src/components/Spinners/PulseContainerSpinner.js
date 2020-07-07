import React from 'react';
import '../../assets/css/spinners.css';

export default ({ width = undefined }) => (
  <div
    className="spinner-box"
    style={{
      width,
    }}
  >
    <div
      className="pulse-container"
      style={{
        width,
      }}
    >
      <div className="pulse-bubble pulse-bubble-1 bg-blue-500"></div>
      <div className="pulse-bubble pulse-bubble-2 bg-blue-500"></div>
      <div className="pulse-bubble pulse-bubble-3 bg-blue-500"></div>
    </div>
  </div>
);
