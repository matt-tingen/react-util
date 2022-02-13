import * as React from 'react';

export const createStatefulProvider = <T,>(
  useValue: () => T,
  Provider: React.Provider<T>,
) =>
  React.memo(({ children }: { children: React.ReactNode }) => {
    const value = useValue();

    return <Provider value={value}>{children}</Provider>;
  });
