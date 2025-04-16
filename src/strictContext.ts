interface Key {
  _: unknown;
}

type NamedStrictContextHook<TValue, TName extends string> = {
  [K in keyof Key as `use${TName}`]: () => TValue;
};
type NamedProvider<TValue, TName extends string> = {
  [K in keyof Key as `${TName}Provider`]: React.Provider<TValue>;
};
export type NamedStrictContextBundle<
  TValue,
  TName extends string,
> = NamedStrictContextHook<TValue, TName> & NamedProvider<TValue, TName>;

type NamedStatefulProvider<TName extends string> = {
  [K in keyof Key as `${TName}Provider`]: React.MemoExoticComponent<
    ({ children }: { children: React.ReactNode }) => React.JSX.Element
  >;
};
export type NamedStrictStatefulContextBundle<
  TValue,
  TName extends string,
> = NamedStrictContextHook<TValue, TName> & NamedStatefulProvider<TName>;
