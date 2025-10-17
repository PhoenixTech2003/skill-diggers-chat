"use client";

import { useRelativeTime } from "~/hooks/use-relative-time";

interface RelativeTimeProps {
  date: Date | number;
  addSuffix?: boolean;
}

export function RelativeTime({ date, addSuffix = true }: RelativeTimeProps) {
  const text = useRelativeTime(date, { addSuffix });
  return <>{text}</>;
}

export default RelativeTime;
