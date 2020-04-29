import { useRef } from 'react';

export type StateSetter<S> = React.Dispatch<React.SetStateAction<S>>;
export type StatePair<S> = [S, StateSetter<S>];
export type StateInitializer<S> = S | (() => S);

export const resolveStateSetter = <S>(
  newState: React.SetStateAction<S>,
  currentState: S,
) => {
  if (typeof newState === 'function') {
    return (newState as Function)(currentState);
  }

  return newState;
};

export const useStableSetter = <S>(setState: StateSetter<S>) => {
  const original = useRef(setState);
  const hasWarned = useRef(false);

  if (setState !== original.current && !hasWarned.current) {
    hasWarned.current = true;

    // If a valid use case for doing this is found, consider adding an "unsafe"
    // variant of pluggable hooks.
    // eslint-disable-next-line no-console
    console.warn(
      'The `setState` passed to a pluggable hook changed between renders. This is unsupported. The original setter will be used.',
    );
  }

  return original.current;
};
