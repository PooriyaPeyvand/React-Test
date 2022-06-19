import { useEffect, useRef, DependencyList } from 'react';

export function usePreventFromInitialRenderHook(callback: () => any, deps: DependencyList) {
  const prevent = useRef(false);

  useEffect(() => {
    if (prevent.current) {
      callback();
    } else prevent.current = true;
  }, deps);
}
export default usePreventFromInitialRenderHook;
