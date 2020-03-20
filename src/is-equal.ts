export const isEqual = <T extends any>(valA: T, valB: any): valB is T => {
  const typeOfA = typeof valA;
  const typeOfB = typeof valA;

  if (typeOfA !== typeOfB) {
    return false;
  }

  switch (typeOfA) {
    case 'function':
      return `${valA}` === `${valB}`;
    case 'object':
      if (!Array.isArray(valA) && !Array.isArray(valB)) {
        return compareObjects(valA, valB);
      }

      if (Array.isArray(valA) && Array.isArray(valB)) {
        return compareArraysFastPath(valA, valB);
      }

      return false;
    case 'string':
    case 'symbol':
    case 'bigint':
    case 'boolean':
    case 'number':
    case 'undefined':
    default:
      return valA === valB;
  }
};

const compareObjects = <T extends Record<string, any>>(
  objA: T,
  objB: any
): objB is T => {
  const isANull = objA === null;
  const isBNull = objB === null;
  if (isANull && isBNull) {
    return true;
  }

  if (isANull || isBNull) {
    return false;
  }

  const objAKeys = Object.keys(objA);
  const objBKeys = Object.keys(objB);

  if (objAKeys.length !== objBKeys.length) {
    return false;
  }

  return objAKeys.every((keyA) => isEqual(objA[keyA], objB[keyA]));
};

const compareArraysFastPath = (arrA: any[], arrB: any[]) => {
  return arrA.length === arrB.length && scanCompareArrays(arrA, arrB);
};

const scanCompareArrays = (arrA: any[], arrB: any[]) => {
  return arrA.every((value, index) => isEqual(value, arrB[index]));
};
