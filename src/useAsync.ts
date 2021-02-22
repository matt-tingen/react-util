import { useAsync as useAsync_ } from 'react-use';

const useAsync = <Result = unknown, Args extends never[] = never[]>(
  fn: (...args: Args | []) => Promise<Result>,
) => useAsync_(fn, [fn]);

export default useAsync;
