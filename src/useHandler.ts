import { AnyFunction } from '@matt-tingen/util';
import { useCallback, useLayoutEffect, useRef } from 'react';

export const useHandler = <T extends AnyFunction>(handler: T) => {
  const handlerRef = useRef(handler);

  useLayoutEffect(() => {
    handlerRef.current = handler;
  });

  return useCallback(
    (...args: Parameters<T>) => handlerRef.current(...args),
    [],
  ) as T;
};
