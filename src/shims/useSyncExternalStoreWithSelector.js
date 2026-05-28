/**
 * ESM reimplementation of use-sync-external-store/with-selector (production).
 * The published `with-selector.js` re-exports CJS that calls `require("react")`; Rolldown
 * keeps that as runtime `require` for externals, which breaks in browser ESM.
 * @license MIT (see node_modules/use-sync-external-store/LICENSE)
 */
import * as React from 'react';

const { useSyncExternalStore, useRef, useEffect, useMemo, useDebugValue } = React;

function is(x, y) {
  return (x === y && (x !== 0 || 1 / x === 1 / y)) || (x !== x && y !== y);
}
const objectIs = typeof Object.is === 'function' ? Object.is : is;

export function useSyncExternalStoreWithSelector(
  subscribe,
  getSnapshot,
  getServerSnapshot,
  selector,
  isEqual,
) {
  const instStorageRef = useRef(null);
  let inst;
  if (instStorageRef.current === null) {
    inst = { hasValue: false, value: null };
    instStorageRef.current = inst;
  } else {
    inst = instStorageRef.current;
  }

  const getSelectedSnapshot = useMemo(
    function () {
      function memoizedSelector(nextSnapshot) {
        if (!hasMemo) {
          hasMemo = true;
          memoizedSnapshot = nextSnapshot;
          nextSnapshot = selector(nextSnapshot);
          if (isEqual !== undefined && inst.hasValue) {
            const currentSelection = inst.value;
            if (isEqual(currentSelection, nextSnapshot)) return (memoizedSelection = currentSelection);
          }
          return (memoizedSelection = nextSnapshot);
        }
        currentSelection = memoizedSelection;
        if (objectIs(memoizedSnapshot, nextSnapshot)) return currentSelection;
        const nextSelection = selector(nextSnapshot);
        if (isEqual !== undefined && isEqual(currentSelection, nextSelection))
          return (memoizedSnapshot = nextSnapshot), currentSelection;
        memoizedSnapshot = nextSnapshot;
        return (memoizedSelection = nextSelection);
      }
      let hasMemo = false,
        memoizedSnapshot,
        memoizedSelection,
        currentSelection;
      const maybeGetServerSnapshot = getServerSnapshot === undefined ? null : getServerSnapshot;
      return [
        function () {
          return memoizedSelector(getSnapshot());
        },
        maybeGetServerSnapshot === null
          ? undefined
          : function () {
              return memoizedSelector(maybeGetServerSnapshot());
            },
      ];
    },
    [getSnapshot, getServerSnapshot, selector, isEqual],
  );

  const value = useSyncExternalStore(subscribe, getSelectedSnapshot[0], getSelectedSnapshot[1]);
  useEffect(
    function () {
      inst.hasValue = true;
      inst.value = value;
    },
    [value],
  );
  useDebugValue(value);
  return value;
}
