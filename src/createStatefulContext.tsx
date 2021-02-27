import * as React from 'react';

const missingValue = {};

const createStatefulContext = <T extends unknown>(
  useValue: () => T,
  defaultValue?: T,
) => {
  const context = React.createContext<T>(
    defaultValue === undefined
      ? ((missingValue as unknown) as T)
      : defaultValue,
  );

  const Provider = ({ children }: { children: React.ReactNode }) => {
    const value = useValue();

    return <context.Provider value={value}>{children}</context.Provider>;
  };

  const useContextValue = () => {
    const value = React.useContext(context);

    if (value === missingValue) {
      throw new Error(
        'useContextValue must be used inside a context provider.',
      );
    }

    return value;
  };

  return [useContextValue, Provider, context] as const;
};

export default createStatefulContext;
