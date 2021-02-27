import { useEffect, useRef } from 'react';

// The `useTitle` from `react-use` does not restore on unmount when using
// `StrictMode`.
const useTitle = (title: string) => {
  const previousTitleRef = useRef(document.title);

  useEffect(() => {
    document.title = title;

    return () => {
      // This error applies only to nodes here.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      document.title = previousTitleRef.current;
    };
  }, [title]);
};

export default useTitle;
