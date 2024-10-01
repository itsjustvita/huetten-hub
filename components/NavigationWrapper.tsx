"use client";

import { Navigation } from "./Navigation";

interface NavigationWrapperProps {
  user: {
    name: string;
    isAdmin: boolean;
    avatar?: string;
  };
}

export function NavigationWrapper({ user }: NavigationWrapperProps) {
  if (!user) {
    console.error("User data is missing in NavigationWrapper");
    return null;
  }

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", { method: "POST" });
      if (response.ok) {
        console.log("Erfolgreich abgemeldet");
        window.location.href = "/login";
      } else {
        console.error("Fehler beim Abmelden");
      }
    } catch (error) {
      console.error("Fehler beim Abmelden:", error);
    }
  };

  return <Navigation user={user} onLogout={handleLogout} />;
}
