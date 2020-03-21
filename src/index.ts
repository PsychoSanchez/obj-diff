import {isEqual} from './is-equal';

/**
 * getObjectsNotIntersectingPart Returns object with keys/values from sourceObject that not intersect with targetObject
 *
 * @param sourceObject Object to get keys from
 * @param targetObject Object to test keys in
 */
const getObjectsNotIntersectingPart = <T extends Record<string, any>>(
  sourceObject: T,
  targetObject: Partial<T>
): Partial<T> => {
  return Object.keys(sourceObject)
    .filter((key) => !(key in targetObject))
    .reduce((accumulated, key) => {
      return {
        ...accumulated,
        [key]: sourceObject[key]
      };
    }, {});
};

type ModifiedDiff<T extends Record<string, any>> = {
  [K in keyof T]: [T[K], T[K]];
};

const getModifiedPart = <T extends Record<string, any>>(
  source: Partial<T>,
  target: Partial<T>
): ModifiedDiff<T> => {
  const intersectingKeys = Object.keys(source).filter((key) => key in target);

  return intersectingKeys.reduce((accumulated, key) => {
    if (isEqual(source[key], target[key])) {
      return accumulated;
    }

    return {
      ...accumulated,
      [key]: [source[key], target[key]]
    };
  }, {} as ModifiedDiff<T>);
};

type Diff<T extends Record<string, any>> = {
  added: Partial<T>;
  removed: Partial<T>;
  modified: ModifiedDiff<T>;
};

export const getObjectsDiff = <T extends Record<string, any>>(
  source: T,
  target: Partial<T>
): Diff<T> => {
  const added = getObjectsNotIntersectingPart(target, source);
  const removed = getObjectsNotIntersectingPart(source, target);
  const modified = getModifiedPart(source, target);

  return {
    added,
    removed,
    modified
  };
};

export const revert = <T extends Record<string, any>>(
  target: T,
  diff: Diff<T>
) => {
  return applyDiff(target, diff, ModifiedDiffState.Previous);
};

export const patch = <T extends Record<string, any>>(
  target: T,
  diff: Diff<T>
) => {
  return applyDiff(target, diff, ModifiedDiffState.Next);
};

const applyDiff = <T extends Record<string, any>>(
  target: T,
  diff: Diff<T>,
  direction: ModifiedDiffState
) => {
  const [toRemove, toAdd] = getDiffToApply(diff, direction);

  const modifiedState = getStateFromModifiedDiff(diff.modified, direction);

  const previousStateWithExtraValues = {
    ...target,
    ...modifiedState,
    ...toAdd
  };

  Object.keys(toRemove).forEach(
    (key) => delete previousStateWithExtraValues[key]
  );

  return previousStateWithExtraValues;
};

/**
 *
 * @param diff Object diff
 * @param direction Direction to apply diff (Next = patch / Previous = revert)
 * @returns {[Partial<T>, Partial<T>]} [ValuesToRemove from target object, Values to add to target object]
 */
const getDiffToApply = <T extends Record<string, any>>(
  diff: Diff<T>,
  direction: ModifiedDiffState
): [Partial<T>, Partial<T>] => {
  return direction === ModifiedDiffState.Next
    ? [diff.removed, diff.added]
    : [diff.added, diff.removed];
};

enum ModifiedDiffState {
  Previous = 0,
  Next = 1
}

const getStateFromModifiedDiff = <T extends Record<string, any>>(
  modifiedDiff: ModifiedDiff<T>,
  state: ModifiedDiffState
): Partial<T> => {
  return Object.keys(modifiedDiff).reduce((accumulated, key) => {
    return {
      ...accumulated,
      [key]: modifiedDiff[key][state]
    };
  }, {});
};
