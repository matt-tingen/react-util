import { createContext } from './createContext';
import { NamedStrictContextBundle } from './strictContext';

const missingValue = Symbol('missing context value');

export const createStrictContext =
  <TValue>() =>
  <TName extends string>(
    name: TName,
  ): NamedStrictContextBundle<TValue, TName> => {
    const [useValue, Provider] = createContext<TValue | typeof missingValue>(
      name,
      missingValue,
    );
    const hookName = `use${name}`;
    const providerName = `${name}Provider`;
    const errorMessage = `${hookName} must be used inside a ${providerName}.`;

    const useStrictValue = () => {
      const value = useValue();

      if (value === missingValue) {
        throw new Error(errorMessage);
      }

      return value;
    };

    return {
      [hookName]: useStrictValue,
      [providerName]: Provider as React.Provider<TValue>,
    } as NamedStrictContextBundle<TValue, TName>;
  };
