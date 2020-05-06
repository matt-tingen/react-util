import { createGlobalState } from 'react-use';
import { StatePair } from './utils';

// This exists separately from `react-use`'s `createGlobalState` because that
// function ORs `undefined` into the state type unconditionally.
const createGlobalStateHook = createGlobalState as <S>(
  initialState: S,
) => () => StatePair<S>;

export default createGlobalStateHook;
