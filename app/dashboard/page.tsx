'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MonthCalendar } from '@/components/MonthCalendar';
import { useEffect, useState } from 'react';

const months = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
];

export default function DashboardPage() {
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.push('/login');
      }
    };

    checkUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', { method: 'POST' });
      if (response.ok) {
        setUser(null);
        router.push('/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (!user) return null; // oder eine Lade-Anzeige

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">
            Jahresübersicht {currentYear}
          </h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="text-indigo-900 border-white hover:bg-white hover:text-indigo-900"
          >
            Abmelden
          </Button>
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
