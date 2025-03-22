import { createStatefulProvider } from './createStatefulProvider';
import { createStrictContext } from './createStrictContext';
import { NamedStrictStatefulContextBundle } from './strictContext';

export const createStrictStatefulContext = <TValue, TName extends string>(
  name: TName,
  useValue: () => TValue,
): NamedStrictStatefulContextBundle<TValue, TName> => {
  const hookName = `use${name}`;
  const providerName = `${name}Provider`;
  const statefulProviderName = `Stateful${name}Provider`;
  const {
    [hookName as `use${TName}`]: useContextValue,
    [providerName as `${TName}Provider`]: Provider,
  } = createStrictContext<TValue>()(name);

  const StatefulProvider = createStatefulProvider(
    useValue,
    Provider as unknown as React.Provider<TValue>,
  );

  StatefulProvider.displayName = statefulProviderName;

  return {
    [hookName]: useContextValue,
    [providerName]: StatefulProvider,
  } as NamedStrictStatefulContextBundle<TValue, TName>;
};
