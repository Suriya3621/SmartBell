// types/schedule.ts
export type Schedule = {
  index: number;
  hour: number;
  minute: number;
  count: number;
  duration: number;
  enabled?: boolean; // Optional for backward compatibility
};