import './globals.css';
import { Inter } from 'next/font/google';
import { NavigationWrapper } from '@/components/NavigationWrapper';
import { cookies } from 'next/headers';
import * as jose from 'jose';

const inter = Inter({ subsets: ['latin'] });

// Definieren Sie einen Typ für den Benutzer
interface User {
  userId: string;
  username: string;
  isAdmin?: boolean;
}

async function getUser(): Promise<User | null> {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return null;
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    return {
      userId: payload.sub,
      username: payload.username as string,
      // Add other necessary User properties
    } as User;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  return (
    <html lang="de">
      <body className={inter.className}>
        {user && (
          <NavigationWrapper
            user={{
              name: user.username,
              isAdmin: user.isAdmin || false,
              // avatar: user.avatar, // Uncomment if you have an avatar field
            }}
          />
        )}
        <main>
          <div className="w-full">{children}</div>
        </main>
      </body>
    </html>
  );
}
