import * as React from 'react';
import { createStatefulProvider } from './createStatefulProvider';
import {
  createStrictContext,
  NamedStrictContextBundle,
} from './createStrictContext';

export const createStrictStatefulContext = <TValue, TName extends string>(
  name: TName,
  useValue: () => TValue,
): NamedStrictContextBundle<TValue, TName> => {
  const hookName = `use${name}`;
  const providerName = `${name}Provider`;
  const {
    [hookName as `use${TName}`]: useContextValue,
    [providerName as `${TName}Provider`]: Provider,
  } = createStrictContext<TValue>()(name);

  const StatefulProvider = createStatefulProvider(
    useValue,
    Provider as unknown as React.Provider<TValue>,
  );

  return {
    [hookName]: useContextValue,
    [providerName]: StatefulProvider,
  };
};
