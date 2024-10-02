'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NavigationWrapper } from '@/components/NavigationWrapper';

interface User {
  userId: string;
  username: string;
  isAdmin?: boolean;
}

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          console.log(userData);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error checking user:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    checkUser();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <>{children}</>;
  }

  return (
    <>
      <NavigationWrapper
        user={{
          name: user.username,
          isAdmin: user.isAdmin || false,
        }}
      />
      <main>
        <div className="w-full">{children}</div>
      </main>
    </>
  );
}
