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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MonthCalendarProps {
  year: number;
  month: number;
}

interface User {
  userId: number;
}

interface Booking {
  id: number;
  check_in_date: string;
  check_out_date: string;
  booking_type: string;
}

interface BookingDetails extends Booking {
  user_name: string;
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

const fetchBookingDetails = async (
  bookingId: number
): Promise<BookingDetails | null> => {
  const response = await fetch(`/api/bookings?id=${bookingId}`, {
    method: "GET",
  });
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const isDateCheckIn = (date: Date, bookings: Booking[]) => {
  return bookings.some((booking) =>
    isSameDay(date, parseISO(booking.check_in_date))
  );
};

const isDateCheckOut = (date: Date, bookings: Booking[]) => {
  return bookings.some((booking) =>
    isSameDay(date, parseISO(booking.check_out_date))
  );
};

const isDateFullyBooked = (date: Date, bookings: Booking[]) => {
  return bookings.some(
    (booking) =>
      isWithinInterval(date, {
        start: parseISO(booking.check_in_date),
        end: parseISO(booking.check_out_date),
      }) && !isSameDay(date, parseISO(booking.check_out_date))
  );
};

const isDateHalfBooked = (date: Date, bookings: Booking[]) => {
  return bookings.some(
    (booking) =>
      isSameDay(date, parseISO(booking.check_in_date)) ||
      isSameDay(date, parseISO(booking.check_out_date))
  );
};

export function MonthCalendar({ year, month }: MonthCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<BookingDetails | null>(
    null
  );
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

  const handleCloseModal = () => {
    setSelectedDate(null);
  };

  const reloadBookings = () => {
    queryClient.invalidateQueries({ queryKey: ["bookings"] });
  };

  const handleDateClick = async (date: Date) => {
    const isFullyBooked = isDateFullyBooked(date, bookings || []);

    if (isFullyBooked) {
      // Zeige alle Buchungen für diesen Tag an
      const dayBookings = bookings?.filter((booking) =>
        isWithinInterval(date, {
          start: parseISO(booking.check_in_date),
          end: parseISO(booking.check_out_date),
        })
      );
      // Hier können Sie die Logik implementieren, um alle Buchungen anzuzeigen
      console.log(dayBookings);
      // Möglicherweise möchten Sie hier auch setSelectedBooking aufrufen
    } else {
      // Tag ist frei oder nur teilweise gebucht
      setSelectedDate(date);
    }
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
      <div className="grid grid-cols-7 gap-1 sm:gap-2 place-items-center">
        {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((day) => (
          <div
            key={day}
            className="text-center font-bold text-white text-xs sm:text-sm w-full"
          >
            {day}
          </div>
        ))}
        {Array.from({ length: emptyDays }).map((_, index) => (
          <div key={`empty-${index}`} className="h-12 w-full"></div>
        ))}
        {days.map((date, index) => {
          const isFullyBooked = isDateFullyBooked(date, bookings || []);
          const isCheckIn = isDateCheckIn(date, bookings || []);
          const isCheckOut = isDateCheckOut(date, bookings || []);

          return (
            <Button
              key={index}
              variant="outline"
              className={`h-8 bg-transparent w-8 p-0 rounded-full text-white overflow-hidden flex flex-col justify-center items-center relative
                ${
                  isSameDay(date, new Date())
                    ? "border-2 border-yellow-400"
                    : "border border-white border-opacity-30"
                }
              `}
              onClick={() => handleDateClick(date)}
            >
              <div className="absolute inset-0 flex">
                <div
                  className={`w-1/2  ${
                    isCheckOut ? "bg-slate-500 bg-opacity-50" : ""
                  }`}
                ></div>
                <div
                  className={`w-1/2 ${
                    isCheckIn ? "bg-slate-500 bg-opacity-50" : ""
                  }`}
                ></div>
              </div>
              {isFullyBooked && !isCheckIn && (
                <div className="absolute inset-0 bg-slate-500 bg-opacity-50"></div>
              )}
              <div className="z-10  font-semibold">{format(date, "d")}</div>
              <div className="z-10 flex w-full mt-1 absolute bottom-1 left-0 right-0 px-1 justify-center gap-1">
                <div
                  className={`h-1 w-1 rounded-full  ${
                    isCheckOut ? "bg-red-500" : "bg-transparent"
                  }`}
                ></div>
                <div
                  className={`h-1 w-1 rounded-full ${
                    isCheckIn ? "bg-green-500" : "bg-transparent"
                  }`}
                ></div>
              </div>
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
      <Dialog
        open={selectedBooking !== null}
        onOpenChange={() => setSelectedBooking(null)}
      >
        <DialogContent className="glassmorphism p-5 text-white">
          <DialogHeader>
            <DialogTitle>Buchungsdetails</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">👤</span>
                <p className="text-sm font-medium">
                  {selectedBooking.user_name}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">🏷️</span>
                <p className="text-sm">{selectedBooking.booking_type}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">📅</span>
                <p className="text-sm">
                  Check-in:{" "}
                  {format(
                    parseISO(selectedBooking.check_in_date),
                    "dd.MM.yyyy"
                  )}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">📅</span>
                <p className="text-sm">
                  Check-out:{" "}
                  {format(
                    parseISO(selectedBooking.check_out_date),
                    "dd.MM.yyyy"
                  )}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
