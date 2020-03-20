import {isEqual} from './is-equal';

export const getObjectsDiff = <T extends Record<string, any>>(
  objA: T,
  objB: Partial<T>
) => {
  const objAKeys = Object.keys(objA);
  const objBKeys = Object.keys(objB);

  const added = objBKeys
    .filter((key) => !(key in objA))
    .reduce((accumulated, key) => {
      return {
        ...accumulated,
        [key]: objB[key]
      };
    }, {});

  const removed = objAKeys
    .filter((key) => !(key in objB))
    .reduce((accumulated, key) => {
      return {
        ...accumulated,
        [key]: objA[key]
      };
    }, {});

  const intersectingKeys = objAKeys.filter((key) => key in objB);

  const modified = intersectingKeys.reduce((accumulated, key) => {
    if (isEqual(objA[key], objB[key])) {
      return accumulated;
    }

    return {
      ...accumulated,
      [key]: [objA[key], objB[key]]
    };
  }, {});

  return {
    added,
    removed,
    modified
  };
};
