// CalendarWrapper.tsx
import { MonthCalendar } from "./MonthCalendar";

export default function CalendarWrapper() {
  const currentDate = new Date();
  return (
    <MonthCalendar
      year={currentDate.getFullYear()}
      month={currentDate.getMonth() + 1}
    />
  );
}
