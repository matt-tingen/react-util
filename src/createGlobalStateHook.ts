import { createGlobalState } from 'react-use';
import { StatePair } from './utils';

// This is re-exported because `react-use`'s `createGlobalState` ORs `undefined`
// into the state type unconditionally.
export const createGlobalStateHook = createGlobalState as <S>(
  initialState: S,
) => () => StatePair<S>;
