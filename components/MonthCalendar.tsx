import React, { useState, useEffect } from "react";
import {
  startOfMonth,
  endOfMonth,
  format,
  eachDayOfInterval,
  getDay,
  isSameDay,
} from "date-fns";
import { de } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { BookingModal } from "@/components/BookingModal";
import { useRouter } from "next/navigation";

interface MonthCalendarProps {
  year: number;
  month: number;
}

interface User {
  userId: number;
  // andere Benutzerfelder...
}

export function MonthCalendar({ year, month }: MonthCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const startDate = startOfMonth(new Date(year, month - 1));
  const endDate = endOfMonth(startDate);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const firstDayOfWeek = getDay(startDate) || 7;
  const emptyDays = firstDayOfWeek > 1 ? firstDayOfWeek - 1 : 0;

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await fetch("/api/user", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const userData = await response.json();
        setUser(userData);
        console.log(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, [router]);

  const handleCloseModal = () => {
    setSelectedDate(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full max-w-md mx-auto text-white">
      <h2 className="text-2xl font-bold mb-4 text-center text-white opacity-85">
        {format(startDate, "MMMM", { locale: de })}
      </h2>
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">
        {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((day) => (
          <div
            key={day}
            className="text-center font-bold text-white text-xs sm:text-sm"
          >
            {day}
          </div>
        ))}
        {Array.from({ length: emptyDays }).map((_, index) => (
          <div key={`empty-${index}`} className="h-5 sm:h-7"></div>
        ))}
        {days.map((date, index) => (
          <Button
            key={index}
            variant="outline"
            className={`h-5 w-5 py-2 px-2 sm:h-7 sm:w-7 rounded-full text-white hover:bg-white hover:text-gray-900 bg-transparent text-xs sm:text-sm ${
              isSameDay(date, new Date()) ? "border-2 border-yellow-400" : ""
            }`}
            onClick={() => setSelectedDate(date)}
          >
            {format(date, "d")}
          </Button>
        ))}
      </div>
      {selectedDate && user && (
        <BookingModal
          checkInDate={selectedDate}
          onClose={handleCloseModal}
          userId={user.userId}
        />
      )}
    </div>
  );
}
