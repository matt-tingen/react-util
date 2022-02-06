/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  ActionCreatorWithoutPayload,
  AnyAction,
  PayloadActionCreator,
  Slice,
  SliceCaseReducers,
} from '@reduxjs/toolkit';
import type { _ActionCreatorWithPreparedPayload } from '@reduxjs/toolkit/dist/createAction';
import produce from 'immer';
import { Dispatch, useMemo, useReducer, useRef } from 'react';

const mapValues = <T, V>(
  object: T,
  iteree: (value: T[keyof T], key: keyof T) => V,
) => {
  const mapped = Object.fromEntries(
    Object.entries(object).map(([key, value]) => [
      key,
      iteree(value, key as keyof T),
    ]),
  );

  return mapped as { [K in keyof T]: V };
};

type ImmerRecipe<T> = (draft: T) => T | void;

type ActionCreatorCollection = Record<string, (...args: never[]) => AnyAction>;
type Dispatchers<Actions extends ActionCreatorCollection> = {
  [A in keyof Actions]: (...args: Parameters<Actions[A]>) => void;
};

type FixedCaseReducerActions<CaseReducers extends SliceCaseReducers<any>> = {
  // Unclear why these have are unioned with `void` normally.
  [Type in keyof CaseReducers]: Exclude<
    CaseReducers[Type] extends {
      prepare: any;
    }
      ? ActionCreatorForCaseReducerWithPrepare<CaseReducers[Type]>
      : ActionCreatorForCaseReducer<CaseReducers[Type]>,
    void
  >;
};

type ActionCreatorForCaseReducer<CR> = CR extends (
  state: any,
  action: infer Action,
) => any
  ? Action extends {
      payload: infer P;
    }
    ? PayloadActionCreator<P>
    : ActionCreatorWithoutPayload
  : ActionCreatorWithoutPayload;

type ActionCreatorForCaseReducerWithPrepare<
  CR extends {
    prepare: any;
  },
> = _ActionCreatorWithPreparedPayload<CR['prepare'], string>;

const buildDispatchers = <AC extends ActionCreatorCollection>(
  dispatch: Dispatch<AnyAction>,
  actionCreators: AC,
) =>
  mapValues(actionCreators, (ac) => (...args: never[]) => {
    dispatch(ac(...args));
  }) as unknown as Dispatchers<AC>;

const getSliceInitialState = <T>(slice: Slice<T>): T =>
  slice.reducer(undefined, { type: 'NO_OP' });

/**
 * Utilizes a `@reduxjs/toolkit` slice to manage react state.
 *
 * @param slice An RTK slice
 * @param produceInitialState A immer producer to modify the slice's initial state
 * @returns A tuple of the current state and a collection of dispatchers corresponding to the slice's actions
 */
export const useSlice = <T, CR extends SliceCaseReducers<T>>(
  slice: Slice<T, CR>,
  produceInitialState?: ImmerRecipe<T>,
): readonly [
  state: T,
  dispatcher: Dispatchers<FixedCaseReducerActions<CR>>,
] => {
  const initialSliceRef = useRef(slice);

  if (slice !== initialSliceRef.current) {
    // eslint-disable-next-line no-console
    console.error(
      `The slice provided to useSlice must be stable. The slice "${initialSliceRef.current.name}" changed between renders`,
    );
  }

  const [state, dispatch] = useReducer(slice.reducer, slice, (slice) => {
    const sliceInitialState = getSliceInitialState(slice);

    return produceInitialState
      ? produce(sliceInitialState, produceInitialState)
      : sliceInitialState;
  });
  const dispatchers = useMemo(
    () =>
      buildDispatchers(
        dispatch,
        initialSliceRef.current.actions as FixedCaseReducerActions<CR>,
      ),
    [],
  );

  return [state, dispatchers];
};
