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

export interface StorageOptions<S> {
  serialize: Serialize<S>;
  deserialize: Deserialize<S>;
}

const defaultOptions: StorageOptions<unknown> = {
  serialize: JSON.stringify,
  deserialize: JSON.parse,
};

const read = <S>(
  storage: Storage,
  key: string,
  defaultValue: S,
  { serialize, deserialize }: StorageOptions<S>,
) => {
  try {
    const storageValue = storage.getItem(key);

    if (storageValue !== null) {
      return deserialize(storageValue);
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
  storage: Storage,
  key: string,
  defaultInitialState: S,
  options: StorageOptions<S> = defaultOptions as StorageOptions<S>,
) => {
  register(storage, key);

  const initialState = read(storage, key, defaultInitialState, options);
  const useGlobalState = createGlobalStateHook(initialState);

  const { serialize, deserialize } = options;

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
          setState(deserialize(value));
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
