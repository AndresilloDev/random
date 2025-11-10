// components/Header.tsx
'use client'; // Necesario para usar hooks

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import LogoutButton from './LogoutButton'; // Ya lo tienes

export default function Header() {
  const { data: session, status } = useSession();
  // status puede ser: 'loading', 'authenticated', 'unauthenticated'

  return (
    <header>
      <nav>
        <Link href="/">Home</Link>
        
        {status === 'loading' && (
          <p>Cargando...</p>
        )}

        {status === 'authenticated' && (
          <div>
            <span>Hola, {session.user?.name || session.user?.email}</span>
            <LogoutButton />
          </div>
        )}

        {status === 'unauthenticated' && (
          <div>
            <Link href="/login">Login</Link>
            <Link href="/signup">Sign Up</Link>
          </div>
        )}
      </nav>
    </header>
  );
}