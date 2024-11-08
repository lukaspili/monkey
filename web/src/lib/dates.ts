import { format, isToday, isYesterday } from "date-fns";

export const formatDate = (date: Date) => {
  return format(date, "yyyy-MM-dd");
};

export const formatDateForDisplay = (date: Date) => {
  if (isToday(date)) {
    return "today";
  }

  if (isYesterday(date)) {
    return "yesterday";
  }

  return `on ${format(date, "MMM d, yyyy")}`;
};
