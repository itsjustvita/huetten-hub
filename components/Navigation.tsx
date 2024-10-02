"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavigationProps {
  user: {
    name: string;
    avatar?: string;
    isAdmin: boolean;
  };
  onLogout: () => void;
}

export function Navigation({ user, onLogout }: NavigationProps) {
  const pathname = usePathname();

  const navItems = [
    { name: "Kalender", path: "/dashboard" },
    { name: "Buchungen", path: "/bookings" },
    ...(user.isAdmin
      ? [
          { name: "Benutzer", path: "/users" },
          { name: "Einstellungen", path: "/settings" },
        ]
      : []),
  ];

  return (
    <nav className="bg-green-950/40 backdrop-filter backdrop-blur-md border-b border-white/30 relative z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`text-sm font-medium transition-colors hover:text-white ${
                  pathname === item.path ? "text-white" : "text-white/70"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-green-950/70 backdrop-filter backdrop-blur-md border border-white/30"
            >
              <DropdownMenuItem
                onSelect={() => (window.location.href = "/profile")}
                className="text-white hover:bg-white/10"
              >
                Profil
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => (window.location.href = "/settings")}
                className="text-white hover:bg-white/10"
              >
                Einstellungen
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={onLogout}
                className="text-white hover:bg-white/10"
              >
                Abmelden
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
