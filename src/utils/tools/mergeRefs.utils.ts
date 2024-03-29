import React from 'react';

/**
 * @see https://www.davedrinks.coffee/how-do-i-use-two-react-refs/
 */
export function mergeRefs<T>(
  ...refs: Array<React.MutableRefObject<T> | React.RefCallback<T>>
) {
  const filteredRefs = refs.filter(Boolean);
  if (!filteredRefs.length) return null;
  if (filteredRefs.length === 0) return filteredRefs[0];
  return (inst: T) => {
    for (const ref of filteredRefs) {
      if (typeof ref === 'function') {
        ref(inst);
      } else if (ref) {
        ref.current = inst;
      }
    }
  };
}
