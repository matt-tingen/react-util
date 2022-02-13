import { createContext } from './createContext';

const missingValue = Symbol('missing context value');

interface Key {
  _: unknown;
}

export type NamedStrictContextHook<TValue, TName extends string> = {
  [K in keyof Key as `use${TName}`]: () => TValue;
};
export type NamedProvider<TValue, TName extends string> = {
  [K in keyof Key as `${TName}Provider`]: React.Provider<TValue>;
};
export type NamedStrictContextBundle<
  TValue,
  TName extends string,
> = NamedStrictContextHook<TValue, TName> & NamedProvider<TValue, TName>;

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
      [providerName]: Provider,
    };
  };
