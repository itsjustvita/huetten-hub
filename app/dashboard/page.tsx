"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MonthCalendar } from "@/components/MonthCalendar";
import { NavigationWrapper } from "@/components/NavigationWrapper";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

interface User {
  userId: string;
  username: string;
  isAdmin?: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
        console.log(userData);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, [router]);

  const handlePreviousYear = () => {
    setCurrentYear((prevYear) => prevYear - 1);
  };

  const handleNextYear = () => {
    setCurrentYear((prevYear) => prevYear + 1);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <div className="w-full min-h-screen relative">
        <NavigationWrapper
          user={{
            name: user.username,
            isAdmin: user.isAdmin || false,
          }}
        />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/1.jpg')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 to-slate-900/70"></div>
        <div className="relative container mx-auto p-4">
          <div className="flex justify-center items-center mb-6">
            <div className="flex items-center space-x-4">
              <Button
                onClick={handlePreviousYear}
                className="bg-white bg-opacity-30 backdrop-filter backdrop-blur-sm text-white hover:bg-white hover:bg-opacity-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <span className="text-2xl font-bold text-white">
                {currentYear}
              </span>
              <Button
                onClick={handleNextYear}
                className="bg-white bg-opacity-30 backdrop-filter backdrop-blur-sm text-white hover:bg-white hover:bg-opacity-50"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {months.map((month, index) => (
              <div
                key={index}
                className="w-full bg-green-950/40 border border-white/30  backdrop-filter backdrop-blur-sm rounded-lg shadow-lg p-6"
              >
                <div className="rounded-md p-4">
                  <MonthCalendar year={currentYear} month={index + 1} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
