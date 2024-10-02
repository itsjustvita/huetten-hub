'use client';

import { LoginForm } from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <div className="container relative flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
        <div
          className="absolute inset-0 bg-cover"
          style={{
            backgroundImage: "url('/images/huette_bg_1.jpg')",
          }}
        />
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-4xl font-bold">
              &ldquo;Einfach schön hier&rdquo;
            </p>
            <footer className="text-lg">- Jeder der schonmal dort war</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8 flex items-center justify-center min-h-screen">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Anmeldung</h1>
            <p className="text-muted-foreground text-sm">
              Bitte logge dich ein, um auf den Buchungskalender zuzugreifen.
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
