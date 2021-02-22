import { useCallback, useRef } from 'react';
import createGlobalStateHook from './createGlobalStateHook';
import { StateSetter, resolveStateSetter } from './utils';

const registeredKeys = new Map<Storage, Set<string>>();

const register = (storage: Storage, key: string) => {
  if (!key) {
    throw new Error('Storage key may not be falsy');
  }

  let storageKeys = registeredKeys.get(storage);

  if (!storageKeys) {
    storageKeys = new Set();
    registeredKeys.set(storage, storageKeys);
  } else if (storageKeys.has(key)) {
    throw new Error(
      `Storage key "${key}" is already registered for this storage interface.`,
    );
  }

  storageKeys.add(key);
};

type Serialize<S> = (value: S) => string;
type Deserialize<S> = (string: string) => S;

export interface StorageOptions<T> {
  storage: Storage;
  serialize: Serialize<T>;
  deserialize: Deserialize<T>;
  // The value is of type unknown because the deserialized value may be from an
  // older version of the instantiated hook. That is, it may need to be merged
  // with defaults to bring it up to date.
  prepareValueAfterLoad(value: unknown): T;
}

const defaultOptions: StorageOptions<unknown> = {
  storage: localStorage,
  serialize: JSON.stringify,
  deserialize: JSON.parse,
  prepareValueAfterLoad: (value) => value,
};

const read = <T>(
  key: string,
  defaultValue: T,
  { storage, serialize, deserialize, prepareValueAfterLoad }: StorageOptions<T>,
) => {
  try {
    const storageValue = storage.getItem(key);

    if (storageValue !== null) {
      return prepareValueAfterLoad(deserialize(storageValue));
    }

    if (defaultValue) {
      storage.setItem(key, serialize(defaultValue));
    }

    return defaultValue;
  } catch (error) {
    // If user is in private mode or has storage restriction, storage can throw.
    // (De)serialization can throw, too.
    // eslint-disable-next-line no-console
    console.error(error);

    return defaultValue;
  }
};

// This exists separately from `react-use`'s
// `useLocalStorage`/`useSessionStorage` because those hooks do not synchronize
// multiple instances of hooks using the same storage+key.
const createStorageStateHook = <S>(
  key: string,
  defaultInitialState: S,
  options?: Partial<StorageOptions<S>>,
) => {
  const allOptions = { ...(defaultOptions as StorageOptions<S>), ...options };
  const { storage, serialize } = allOptions;

  register(storage, key);

  const initialState = read(key, defaultInitialState, allOptions);
  const useGlobalState = createGlobalStateHook(initialState);

  return () => {
    const [state, setState] = useGlobalState();
    const stateRef = useRef(state);

    stateRef.current = state;

    const set: StateSetter<S> = useCallback(
      (setStateAction) => {
        const newState = resolveStateSetter(setStateAction, stateRef.current);
        const value = serialize(newState);

        try {
          storage.setItem(key, value);
          setState(newState);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      },
      [setState],
    );

    const reset = () => {
      setState(initialState);

      try {
        storage.removeItem(key);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    };

    return [state, set, reset] as const;
  };
};

export default createStorageStateHook;
