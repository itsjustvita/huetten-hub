"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { NavigationWrapper } from "@/components/NavigationWrapper";
import { WeatherWidget } from "@/components/WeatherWidget";

interface User {
  userId: string;
  username: string;
  isAdmin?: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
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
          throw new Error(`HTTP-Fehler! Status: ${response.status}`);
        }

        const userData = await response.json();
        console.log(userData);
        setUser(userData);
      } catch (error) {
        console.error("Fehler beim Abrufen der Benutzerdaten:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, [router]);

  if (isLoading) {
    return <div>Laden...</div>;
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <WeatherWidget />
          </div>
        </div>
      </div>
    </>
  );
}
