// components/LogoutButton.tsx
'use client';

import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  const handleLogout = () => {
    // Aquí le dices "después de cerrar sesión, envíame a /"
    signOut({ callbackUrl: '/login' }); 
  };

  return (
    <button onClick={handleLogout}>
      Cerrar Sesión
    </button>
  );
}