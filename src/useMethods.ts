import { useMemo, useState } from 'react';
import { InputStatePair, StateInitializer, useStableSetter } from './utils';

type MethodsFactory<S> = (state: S) => Methods<S>;

interface Methods<S> {
  [name: string]: (...args: never[]) => S;
}

type Dispatchers<M extends Methods<unknown>> = {
  [K in keyof M]: (...args: Parameters<M[K]>) => void;
};

export const usePluggableMethods = <S, MF extends MethodsFactory<S>>(
  [state, setState]: InputStatePair<S>,
  methodsFactory: MF,
) => {
  // eslint-disable-next-line no-param-reassign
  setState = useStableSetter(setState);

  // It is assumed that the _name_ of the produced methods will not change for a
  // given factory.

  const methodNames = useMemo(
    () => Object.keys(methodsFactory(state)),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- any state object is acceptable here; it doesn't need to be the latest
    [methodsFactory],
  );

  const dispatchers = useMemo(
    () =>
      Object.fromEntries(
        methodNames.map((name) => [
          name,
          (...args: never[]) => {
            setState((prev) => methodsFactory(prev)[name](...args));
          },
        ]),
      ) as unknown as Dispatchers<ReturnType<MF>>,
    [methodsFactory, methodNames, setState],
  );

  return [state, dispatchers] as const;
};

export const useMethods = <S, MF extends MethodsFactory<S>>(
  initialState: StateInitializer<S>,
  methodsFactory: MF,
) => usePluggableMethods(useState(initialState), methodsFactory);
