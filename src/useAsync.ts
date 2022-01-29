import { useAsync as useAsync_ } from 'react-use';
import { FunctionReturningPromise } from 'react-use/lib/misc/types';

export const useAsync = <T extends FunctionReturningPromise>(fn: T) =>
  useAsync_(fn, [fn]);
