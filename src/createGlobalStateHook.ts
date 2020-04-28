import { useLayoutEffect, useState } from 'react';
import { useEffectOnce } from 'react-use';
import { StateSetter, resolveStateSetter } from './utils';

// This exists separately from `react-use`'s `createGlobalState` because that
// function ORs `undefined` into the state type unconditionally.
const createGlobalStateHook = <S>(initialState: S) => {
  const store: {
    state: S;
    setState: StateSetter<S>;
    setters: StateSetter<S>[];
  } = {
    state: initialState,
    setState(state) {
      store.state = resolveStateSetter(state, store.state);

      store.setters.forEach((setter) => setter(store.state));
    },
    setters: [],
  };

  return () => {
    const [globalState, stateSetter] = useState(store.state);

    useEffectOnce(() => () => {
      store.setters = store.setters.filter((setter) => setter !== stateSetter);
    });

    useLayoutEffect(() => {
      if (!store.setters.includes(stateSetter)) {
        store.setters.push(stateSetter);
      }
    }, []);

    return [globalState, store.setState] as const;
  };
};

export default createGlobalStateHook;
