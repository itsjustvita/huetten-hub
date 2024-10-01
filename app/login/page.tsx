'use client';

import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/LoginForm';
import { useEffect } from 'react';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      router.replace('/dashboard');
    }
  }, [router]);

  const handleLogin = (username: string, password: string) => {
    if (username === 'admin' && password === 'password') {
      const user = {
        name: 'Admin User',
        isAdmin: true,
      };
      localStorage.setItem('user', JSON.stringify(user));
      // Setzen Sie einen Cookie für die Middleware
      document.cookie = 'isLoggedIn=true; path=/';
      router.replace('/dashboard');
    } else {
      alert('Ungültige Anmeldeinformationen');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <LoginForm onLogin={handleLogin} />
    </div>
  );
}
