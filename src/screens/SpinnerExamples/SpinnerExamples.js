import React, { useEffect, useState } from 'react';
import { BlueOrbitLeoSpinner } from 'components/Spinners';
import { CircleBorderSpinner } from 'components/Spinners';
import { ConfigureBorderSpinner } from 'components/Spinners';
import { LeoBorderSpinner } from 'components/Spinners';
import { PulseContainerSpinner } from 'components/Spinners';
import { SolarSystemSpinner } from 'components/Spinners';

const SpinnerContainer = ({ children, classes }) => <div className={classes}>{children}</div>;

const SpinnerExamples = ({ history }) => {
  return (
    <div className="flex flex-row flex-wrap justify-between w-full">
      <SpinnerContainer classes="ml-40">
        <BlueOrbitLeoSpinner />
        BlueOrderLeoSpinner
      </SpinnerContainer>
      <SpinnerContainer>
        <CircleBorderSpinner />
        CircleBorderSpinner
      </SpinnerContainer>
      <SpinnerContainer>
        <ConfigureBorderSpinner />
        ConfigureBorderSpinner
      </SpinnerContainer>
      <SpinnerContainer>
        <LeoBorderSpinner />
        LeoBorderSpinner
      </SpinnerContainer>
      <SpinnerContainer>
        <PulseContainerSpinner />
        PulseContainerSpinner
      </SpinnerContainer>
      <SpinnerContainer>
        <SolarSystemSpinner />
        SolarSystemSpinner
      </SpinnerContainer>
    </div>
  );
};

export default SpinnerExamples;
