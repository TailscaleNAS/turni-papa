import { useState, useEffect } from 'react';
import { subscribeToShifts } from '../firebase/database';

export function useShifts(year, month) {
  const [shifts, setShifts] = useState({});

  useEffect(() => {
    const unsub = subscribeToShifts(year, month, setShifts);
    return unsub;
  }, [year, month]);

  return shifts;
}
