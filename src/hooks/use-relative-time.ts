"use client";

import { useEffect, useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";

export interface UseRelativeTimeOptions {
  addSuffix?: boolean;
}

export function useRelativeTime(
  date: Date | number,
  options?: UseRelativeTimeOptions,
): string {
  const inputTime = useMemo(
    () => (typeof date === "number" ? new Date(date) : date),
    [date],
  );
  const [, setTick] = useState<number>(0);

  useEffect(() => {
    // Align the first tick to the next minute boundary for smoother updates
    const msUntilNextMinute = 60000 - (Date.now() % 60000);
    let intervalId: ReturnType<typeof setInterval> | null = null;
    const timeoutId = setTimeout(() => {
      setTick((t) => t + 1);
      intervalId = setInterval(() => setTick((t) => t + 1), 60000);
    }, msUntilNextMinute);

    return () => {
      if (intervalId) clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []);

  return formatDistanceToNow(inputTime, {
    addSuffix: options?.addSuffix ?? true,
    includeSeconds: false,
  });
}

export default useRelativeTime;
