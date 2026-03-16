import { useState, useCallback, useRef } from 'react';

export function useAdaptiveDifficulty(baseMax: number) {
  const [adjustment, setAdjustment] = useState(0);
  const errorsRef = useRef(0);
  const correctRef = useRef(0);

  const recordCorrect = useCallback(() => {
    errorsRef.current = 0;
    correctRef.current++;
    if (correctRef.current >= 3) {
      setAdjustment(0); // Restore original
      correctRef.current = 0;
    }
  }, []);

  const recordWrong = useCallback(() => {
    correctRef.current = 0;
    errorsRef.current++;
    if (errorsRef.current >= 3) {
      setAdjustment((a) => Math.max(a - 1, -(baseMax - 2))); // min 2 options
      errorsRef.current = 0;
    }
  }, [baseMax]);

  const adjustedMax = Math.max(2, baseMax + adjustment);

  return { adjustedMax, recordCorrect, recordWrong };
}
