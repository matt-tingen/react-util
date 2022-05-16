import { useAsync } from '@react-hookz/web';
import { useEffect, useMemo } from 'react';

export type AutoAsyncState<T> =
  | {
      loading: boolean;
      error?: undefined;
      value?: undefined;
    }
  | {
      loading: true;
      error?: Error | undefined;
      value?: T;
    }
  | {
      loading: false;
      error: Error;
      value?: undefined;
    }
  | {
      loading: false;
      error?: undefined;
      value: T;
    };

export const useAutoAsync = <T>(asyncFn: () => Promise<T>) => {
  const [{ error, result, status }, { execute }] = useAsync(asyncFn);

  useEffect(() => {
    execute();
  }, [asyncFn, execute]);

  const loading = status === 'not-executed' || status === 'loading';

  const state = useMemo(
    () =>
      ({
        value: result,
        error,
        loading,
      } as AutoAsyncState<T>),
    [error, loading, result],
  );

  return state;
};
