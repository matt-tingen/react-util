import { useAsyncFn as useAsyncFn_ } from 'react-use';
import type {
  FunctionReturningPromise,
  PromiseType,
} from 'react-use/lib/misc/types';
import type { AsyncState } from 'react-use/lib/useAsync';

type StateFromFunctionReturningPromise<T extends FunctionReturningPromise> =
  AsyncState<PromiseType<ReturnType<T>>>;

export const useAsyncFn = <T extends FunctionReturningPromise>(
  fn: T,
  initialState?: StateFromFunctionReturningPromise<T>,
) => useAsyncFn_(fn, [fn], initialState);
