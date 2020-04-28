export type StateSetter<S> = React.Dispatch<React.SetStateAction<S>>;
export type StatePair<S> = [S, StateSetter<S>];
export type StateInitializer<S> = S | (() => S);

export const resolveStateSetter = <S>(
  newState: React.SetStateAction<S>,
  currentState: S,
) => {
  if (typeof newState === 'function') {
    return (newState as Function)(currentState);
  }

  return newState;
};
