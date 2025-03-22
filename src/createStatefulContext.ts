import { createContext } from './createContext';
import { createStatefulProvider } from './createStatefulProvider';

export const createStatefulContext = <TValue>(
  name: string,
  useValue: () => TValue,
  defaultValue?: TValue,
) => {
  const [useContextValue, Provider] = createContext(name, defaultValue);

  const StatefulProvider = createStatefulProvider(useValue, Provider);

  return [useContextValue, StatefulProvider] as const;
};
