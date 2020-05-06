import { useState } from 'react';
import { usePluggableMethods } from './useMethods';
import { StateInitializer, InputStatePair } from './utils';

const toggleMethodsFactory = (state: boolean) => ({
  toggle(nextValue?: boolean) {
    return typeof nextValue === 'boolean' ? nextValue : !state;
  },
});

export const usePluggableToggle = (statePair: InputStatePair<boolean>) => {
  const [state, { toggle }] = usePluggableMethods(
    statePair,
    toggleMethodsFactory,
  );

  return [state, toggle] as const;
};

export const useToggle = (initialState: StateInitializer<boolean> = false) =>
  usePluggableToggle(useState(initialState));

export default useToggle;
