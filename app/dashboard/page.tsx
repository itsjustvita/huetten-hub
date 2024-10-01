"use client";

import { MonthCalendar } from "@/components/MonthCalendar";

const months = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];

export default function DashboardPage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">
            Jahresübersicht {currentYear}
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {months.map((month, index) => (
            <div
              key={index}
              className="w-full bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-lg shadow-lg p-6"
            >
              <div className="rounded-md p-4">
                <MonthCalendar year={currentYear} month={index + 1} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
