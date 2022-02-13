import { createContext as reactCreateContext, useContext } from 'react';

export type ContextBundle<TValue> = [
  useValue: () => TValue,
  Provider: React.Provider<TValue>,
  Context: React.Context<TValue>,
];

export const createContext = <TValue>(
  name: string,
  defaultValue: TValue,
): ContextBundle<TValue> => {
  const headChar = name.charAt(0);

  if (!headChar) throw new Error('Context name must not be empty');
  if (headChar !== headChar.toUpperCase())
    throw new Error('Context name must start with a capital letter');

  const useContextValue = () => useContext(Context);
  const Context = reactCreateContext<TValue>(defaultValue);

  Context.displayName = `${name}Context`;

  return [useContextValue, Context.Provider, Context];
};
