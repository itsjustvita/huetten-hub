import React, { useState } from 'react';
import {
  startOfMonth,
  endOfMonth,
  format,
  eachDayOfInterval,
  getDay,
} from 'date-fns';
import { de } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { BookingModal } from '@/components/BookingModal';

interface MonthCalendarProps {
  year: number;
  month: number;
}

export function MonthCalendar({ year, month }: MonthCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const startDate = startOfMonth(new Date(year, month - 1));
  const endDate = endOfMonth(startDate);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Adjust for Monday as the first day of the week
  const firstDayOfWeek = getDay(startDate) || 7;
  const emptyDays = firstDayOfWeek > 1 ? firstDayOfWeek - 1 : 0;

  return (
    <div className="w-full max-w-md mx-auto text-white">
      <h2 className="text-2xl font-bold mb-4 text-center text-white">
        {format(startDate, 'MMMM yyyy', { locale: de })}
      </h2>
      <div className="grid grid-cols-7 gap-1">
        {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day) => (
          <div key={day} className="text-center font-bold text-white">
            {day}
          </div>
        ))}
        {Array.from({ length: emptyDays }).map((_, index) => (
          <div key={`empty-${index}`} className="h-10"></div>
        ))}
        {days.map((date, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-10 text-indigo-900 border-white hover:bg-white hover:text-gray-900"
            onClick={() => setSelectedDate(date)}
          >
            {format(date, 'd')}
          </Button>
        ))}
      </div>
      {selectedDate && (
        <BookingModal
          checkInDate={selectedDate}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
}
