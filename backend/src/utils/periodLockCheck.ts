import PeriodLock from "../models/PeriodLock";

export const isPeriodLocked = async (dateStr: string): Promise<boolean> => {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return false;

  const month = date.getMonth() + 1; // JavaScript getMonth() is 0-11
  const year = date.getFullYear();

  const lock = await PeriodLock.findOne({ month, year, locked: true });
  return !!lock;
};
