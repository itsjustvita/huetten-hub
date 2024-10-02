import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
const inter = Inter({ subsets: ['latin'] });

// Definieren Sie einen Typ für den Benutzer

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <main>
          <div className="w-full">{children}</div>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
