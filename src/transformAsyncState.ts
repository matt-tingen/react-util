import { AsyncState } from 'react-use/lib/useAsync';

export const transformAsyncState = <T, U>(
  state: AsyncState<T>,
  transform: (value: T | undefined) => U,
) => {
  const { value, ...rest } = state;

  const transformedValue = transform(value);

  return { value: transformedValue, ...rest } as AsyncState<U>;
};
