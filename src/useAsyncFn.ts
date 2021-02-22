import { useAsyncFn as useAsyncFn_ } from 'react-use';
import { AsyncState } from 'react-use/lib/useAsync';

const useAsyncFn = <Result = unknown, Args extends never[] = never[]>(
  fn: (...args: Args | []) => Promise<Result>,
  initialState?: AsyncState<Result>,
) => useAsyncFn_(fn, [fn], initialState);

export default useAsyncFn;
