import { useRef } from 'react';

const useEvergreenRef = <T>(value: T) => {
  const ref = useRef(value);

  ref.current = value;

  return ref;
};

export default useEvergreenRef;
