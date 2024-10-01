'use client';

import { Navigation } from './Navigation';

interface NavigationWrapperProps {
  user: {
    name: string;
    isAdmin: boolean;
    avatar?: string;
  };
}

export function NavigationWrapper({ user }: NavigationWrapperProps) {
  const handleLogout = () => {
    // Implementieren Sie hier Ihre Logout-Logik
    console.log('Logout');
    // Beispiel:
    // router.push('/logout');
  };

  return <Navigation user={user} onLogout={handleLogout} />;
}
