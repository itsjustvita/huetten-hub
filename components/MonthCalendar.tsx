"use client";

import React, { useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  format,
  eachDayOfInterval,
  getDay,
  isSameDay,
  isWithinInterval,
  parseISO,
} from "date-fns";
import { de } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { BookingModal } from "@/components/BookingModal";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface MonthCalendarProps {
  year: number;
  month: number;
}

interface User {
  userId: number;
}

interface Booking {
  check_in_date: string;
  check_out_date: string;
  booking_type: string;
}

const fetchUser = async (): Promise<User> => {
  const response = await fetch("/api/user", {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const fetchBookings = async (): Promise<Booking[]> => {
  const response = await fetch("/api/bookings", { method: "GET" });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export function MonthCalendar({ year, month }: MonthCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    retry: false,
  });

  const {
    data: bookings,
    isLoading: isBookingsLoading,
    error: bookingsError,
  } = useQuery({
    queryKey: ["bookings"],
    queryFn: fetchBookings,
  });

  const startDate = startOfMonth(new Date(year, month - 1));
  const endDate = endOfMonth(startDate);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const firstDayOfWeek = getDay(startDate) || 7;
  const emptyDays = firstDayOfWeek > 1 ? firstDayOfWeek - 1 : 0;

  const isDateBooked = (date: Date) => {
    return (
      bookings?.some((booking) =>
        isWithinInterval(date, {
          start: parseISO(booking.check_in_date),
          end: parseISO(booking.check_out_date),
        })
      ) || false
    );
  };

  const handleCloseModal = () => {
    setSelectedDate(null);
  };

  const reloadBookings = () => {
    queryClient.invalidateQueries({ queryKey: ["bookings"] });
  };

  if (isUserLoading || isBookingsLoading) {
    return <div>Loading...</div>;
  }

  if (userError || bookingsError) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="w-full max-w-md mx-auto text-white">
      <h2 className="text-2xl font-bold mb-4 text-center text-white opacity-85">
        {format(startDate, "MMMM", { locale: de })}
      </h2>
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5 place-items-center">
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
        {days.map((date, index) => {
          const isBooked = isDateBooked(date);
          return (
            <Button
              key={index}
              variant="outline"
              className={`h-7 w-7 py-2 px-2 sm:h-7 sm:w-7 rounded-full text-white 
                ${
                  isBooked
                    ? "bg-red-500  text-white"
                    : "hover:bg-white hover:text-gray-900 bg-transparent"
                } 
                ${
                  isSameDay(date, new Date())
                    ? "border-2 border-yellow-400"
                    : ""
                }
              `}
              onClick={() => !isBooked && setSelectedDate(date)}
            >
              {format(date, "d")}
            </Button>
          );
        })}
      </div>
      {selectedDate && user && (
        <BookingModal
          checkInDate={selectedDate}
          onClose={() => {
            handleCloseModal();
            reloadBookings();
          }}
          userId={user.userId}
          onBookingComplete={reloadBookings}
        />
      )}
    </div>
  );
}
