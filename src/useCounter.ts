import { useMemo, useState } from 'react';
import { usePluggableMethods } from './useMethods';
import { StatePair } from './utils';

interface CounterConfig {
  initialValue: number;
  min: number;
  max: number;
}

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max));

const counterMethodsFactoryFactory = ({
  initialValue,
  min,
  max,
}: CounterConfig) => (state: number) => {
  const c = (count: number) => clamp(count, min, max);

  return {
    inc(delta = 1) {
      return c(state + delta);
    },
    dec(delta = 1) {
      return c(state - delta);
    },
    set(count: number) {
      return c(count);
    },
    reset() {
      return c(initialValue);
    },
  };
};

export const usePluggableCounter = (
  statePair: StatePair<number>,
  {
    initialValue = 0,
    min = -Infinity,
    max = Infinity,
  }: Partial<CounterConfig> = {},
) => {
  const factory = useMemo(
    () => counterMethodsFactoryFactory({ initialValue, min, max }),
    [initialValue, min, max],
  );

  return usePluggableMethods(statePair, factory);
};

export const useCounter = ({
  initialValue = 0,
  min = -Infinity,
  max = Infinity,
}: Partial<CounterConfig> = {}) =>
  usePluggableCounter(
    useState(() => clamp(initialValue, min, max)),
    { initialValue, min, max },
  );

export default useCounter;
