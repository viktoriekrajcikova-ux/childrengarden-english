import { useRef, useEffect } from 'react';

type SetTimerFn = ((fn: () => void, delay: number) => ReturnType<typeof setTimeout>) & {
  clearAll: () => void;
};

export function useTimers(): SetTimerFn {
  const timersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const apiRef = useRef<SetTimerFn | null>(null);

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach(clearTimeout);
      timers.clear();
    };
  }, []);

  if (!apiRef.current) {
    const fn = ((cb: () => void, delay: number) => {
      const id = setTimeout(() => {
        timersRef.current.delete(id);
        cb();
      }, delay);
      timersRef.current.add(id);
      return id;
    }) as SetTimerFn;
    fn.clearAll = () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current.clear();
    };
    apiRef.current = fn;
  }

  return apiRef.current;
}
