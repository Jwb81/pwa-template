export const formatNumberWithCommas = (num, toFixedLength = null) => {
  if (isNaN(num)) {
    return num;
  }

  // convert to a string so we can split it on the decimal
  const numSplit = num.toString().split('.');

  const leftSide = numSplit[0]; // getting all numbers left of the decimal
  const rightSide = numSplit[1]; // getting all numbers right of the decimal

  const formattedLeftSide = leftSide
    .split('')
    .reverse()
    .map((char, charIdx) => (charIdx && charIdx % 3 === 0 ? char + ',' : char))
    .reverse()
    .join('');

  let formattedRightSide = '';

  if (toFixedLength !== null) {
    for (let i = 0; i < toFixedLength; i++) {
      formattedRightSide += `${!!rightSide && rightSide[i] != undefined ? rightSide[i] : 0}`;
    }
  }

  return !!formattedRightSide ? `${formattedLeftSide}.${formattedRightSide}` : formattedLeftSide;
};

export const findUniqueArray = (array, matchOptions) => {
  return array.reduce((acc, cur) => {
    if (typeof matchOptions === 'function' && acc.find((item, idx) => matchOptions(item, cur))) return acc;
    if (typeof matchOptions === 'string' && acc.find((item, idx) => item[matchOptions] === cur[matchOptions]))
      return acc;
    if (
      Array.isArray(matchOptions) &&
      acc.find((item, idx) => matchOptions.every(matchOpt => item[matchOpt] === cur[matchOpt]))
    )
      return acc;

    acc.push(cur);
    return acc;
  }, []);
};
